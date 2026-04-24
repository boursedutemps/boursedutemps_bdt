"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Notification } from "@/types";
import { supabase } from "@/lib/supabaseClient";
import { registerServiceWorker, subscribeUserToPush } from "@/lib/push";

interface UserContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  notifications: Notification[];
  logout: () => void;
  isAuthReady: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // 🔵 Supabase Auth Listener
  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase client is not initialized. Please check your environment variables.");
      setIsAuthReady(true);
      return;
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.access_token) {
          localStorage.setItem("token", session.access_token);

          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });

          const data = await res.json();
          if (!data.error) setUser(data);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }

        setIsAuthReady(true);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 🔵 Notifications via Supabase Realtime (remplace le polling)
  useEffect(() => {
    if (!user || !supabase) {
      setNotifications([]);
      return;
    }

    // Chargement initial
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data as Notification[]);
        }
      } catch (e) {
        console.error("Error fetching notifications:", e);
      }
    };

    fetchNotifications();

    // Abonnement Realtime — écoute les INSERT sur la table notifications pour cet utilisateur
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Ajouter la nouvelle notification en tête de liste
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Mettre à jour la notification modifiée (ex: marquée comme lue)
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === (payload.new as Notification).id
                ? (payload.new as Notification)
                : n
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Supprimer la notification de la liste
          setNotifications((prev) =>
            prev.filter((n) => n.id !== (payload.old as Notification).id)
          );
        }
      )
      .subscribe();

    // Push notifications
    registerServiceWorker().then(() => {
      subscribeUserToPush();
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 🔴 LOGOUT — VERSION SUPABASE
  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, notifications, logout, isAuthReady }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
