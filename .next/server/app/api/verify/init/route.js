"use strict";(()=>{var e={};e.id=3457,e.ids=[3457],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},61282:e=>{e.exports=require("child_process")},84770:e=>{e.exports=require("crypto")},80665:e=>{e.exports=require("dns")},17702:e=>{e.exports=require("events")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},55315:e=>{e.exports=require("path")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},8678:e=>{e.exports=import("pg")},96373:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{originalPathname:()=>u,patchFetch:()=>T,requestAsyncStorage:()=>R,routeModule:()=>n,serverHooks:()=>l,staticGenerationAsyncStorage:()=>d});var E=r(73278),i=r(45002),o=r(54877),a=r(48366),A=e([a]);a=(A.then?(await A)():A)[0];let n=new E.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/verify/init/route",pathname:"/api/verify/init",filename:"route",bundlePath:"app/api/verify/init/route"},resolvedPagePath:"P:\\boursedutemps\\app\\api\\verify\\init\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:R,staticGenerationAsyncStorage:d,serverHooks:l}=n,u="/api/verify/init/route";function T(){return(0,o.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:d})}s()}catch(e){s(e)}})},48366:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{POST:()=>n});var E=r(71309),i=r(1035),o=r(84770),a=r.n(o),A=r(7077),T=e([i]);async function n(e){let{email:t}=await e.json();if(!t)return E.NextResponse.json({error:"Email requis"},{status:400});let r=a().randomInt(1e5,999999).toString();try{return await (0,i.IO)("DELETE FROM otps WHERE identifier = $1",[t]),await (0,i.IO)("INSERT INTO otps (identifier, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL '10 minutes')",[t,r]),await (0,A.Sg)(t,r),console.log(`📧 OTP g\xe9n\xe9r\xe9 pour ${t}: ${r}`),E.NextResponse.json({success:!0})}catch(e){return console.error("Error:",e),E.NextResponse.json({error:"Erreur serveur"},{status:500})}}i=(T.then?(await T)():T)[0],s()}catch(e){s(e)}})},1035:(e,t,r)=>{r.a(e,async(e,s)=>{try{r.d(t,{IO:()=>n});var E=r(8678),i=e([E]);E=(i.then?(await i)():i)[0];let o="postgres://mock:mock@localhost:5432/mock",a=!0;if(process.env.DATABASE_URL)try{new URL(process.env.DATABASE_URL),o=process.env.DATABASE_URL,a=!1,console.log("[DB] DATABASE_URL is set and valid.")}catch(e){console.error("[DB] Invalid DATABASE_URL format. Falling back to mock URL for build/safety.")}else console.warn("========================================================="),console.warn("WARNING: DATABASE_URL environment variable is missing."),console.warn("Using a mock URL for build purposes."),console.warn("=========================================================");let A=new E.default.Pool({connectionString:o,ssl:!o.includes("localhost")&&{rejectUnauthorized:!1},connectionTimeoutMillis:5e3}),T=!1,n=async(e,t)=>{if(a)return console.warn(`[DB] Mock mode active. Returning empty result for query: ${e.substring(0,50)}...`),{rows:[],rowCount:0};if(!A)throw Error("Database pool not initialized");return T||-1!==e.toLowerCase().indexOf("create table")||-1!==e.toLowerCase().indexOf("alter table")||(await R(),T=!0),await A.query(e,t)},R=async()=>{if(A&&!a)try{let e=await A.connect();try{await e.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        uid VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(255),
        campus VARCHAR(255),
        department VARCHAR(255),
        gender VARCHAR(50),
        country VARCHAR(255),
        availability VARCHAR(255),
        languages JSONB,
        offered_skills JSONB,
        requested_skills JSONB,
        bio TEXT,
        skills TEXT[],
        needs TEXT[],
        avatar VARCHAR(255),
        cover_photo VARCHAR(255),
        credits INTEGER DEFAULT 5,
        role VARCHAR(50) DEFAULT 'user',
        status VARCHAR(50) DEFAULT 'active',
        verified BOOLEAN DEFAULT true,
        is_verified_email BOOLEAN DEFAULT true,
        is_verified_sms BOOLEAN DEFAULT true,
        terms_accepted BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN gender VARCHAR(50);
        EXCEPTION
          WHEN duplicate_column THEN null;
        END;
        BEGIN
          ALTER TABLE users ADD COLUMN country VARCHAR(255);
        EXCEPTION
          WHEN duplicate_column THEN null;
        END;
        BEGIN
          ALTER TABLE users ADD COLUMN availability VARCHAR(255);
        EXCEPTION
          WHEN duplicate_column THEN null;
        END;
        BEGIN
          ALTER TABLE users ADD COLUMN languages JSONB;
        EXCEPTION
          WHEN duplicate_column THEN null;
        END;
        BEGIN
          ALTER TABLE users ADD COLUMN offered_skills JSONB;
        EXCEPTION
          WHEN duplicate_column THEN null;
        END;
        BEGIN
          ALTER TABLE users ADD COLUMN requested_skills JSONB;
        EXCEPTION
          WHEN duplicate_column THEN null;
        END;
        BEGIN
          ALTER TABLE users ADD COLUMN terms_accepted BOOLEAN DEFAULT true;
        EXCEPTION
          WHEN duplicate_column THEN null;
        END;
        BEGIN
          ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT false;
        EXCEPTION
          WHEN duplicate_column THEN null;
        END;
        BEGIN
          ALTER TABLE live_sessions ALTER COLUMN room_url TYPE TEXT;
        EXCEPTION
          WHEN undefined_table THEN null;
          WHEN undefined_column THEN null;
        END;
      END $$;

      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(uid),
        user_name VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        credit_cost INTEGER NOT NULL,
        category VARCHAR(255),
        status VARCHAR(50) DEFAULT 'proposed',
        accepted_by VARCHAR(255) REFERENCES users(uid),
        accepted_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(uid),
        user_name VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        credit_offer INTEGER NOT NULL,
        category VARCHAR(255),
        status VARCHAR(50) DEFAULT 'proposed',
        fulfilled_by VARCHAR(255) REFERENCES users(uid),
        fulfilled_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        author_id VARCHAR(255) REFERENCES users(uid),
        author_name VARCHAR(255),
        author_avatar VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(255),
        media JSONB DEFAULT '[]',
        likes TEXT[] DEFAULT '{}',
        dislikes TEXT[] DEFAULT '{}',
        shares INTEGER DEFAULT 0,
        reposts INTEGER DEFAULT 0,
        comments JSONB DEFAULT '[]',
        external_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        author_id VARCHAR(255) REFERENCES users(uid),
        author_name VARCHAR(255),
        author_avatar VARCHAR(255),
        title VARCHAR(255),
        content TEXT NOT NULL,
        rating INTEGER NOT NULL,
        media JSONB DEFAULT '[]',
        likes TEXT[] DEFAULT '{}',
        dislikes TEXT[] DEFAULT '{}',
        shares INTEGER DEFAULT 0,
        reposts INTEGER DEFAULT 0,
        comments JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS forum_topics (
        id SERIAL PRIMARY KEY,
        author_id VARCHAR(255) REFERENCES users(uid),
        author_name VARCHAR(255),
        author_avatar VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(255),
        media JSONB DEFAULT '[]',
        likes TEXT[] DEFAULT '{}',
        dislikes TEXT[] DEFAULT '{}',
        shares INTEGER DEFAULT 0,
        reposts INTEGER DEFAULT 0,
        comments JSONB DEFAULT '[]',
        external_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS connections (
        id SERIAL PRIMARY KEY,
        sender_id VARCHAR(255) REFERENCES users(uid),
        receiver_id VARCHAR(255) REFERENCES users(uid),
        status VARCHAR(50) DEFAULT 'sent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        from_id VARCHAR(255) REFERENCES users(uid),
        to_id VARCHAR(255) REFERENCES users(uid),
        amount INTEGER NOT NULL,
        service_title VARCHAR(255),
        type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(uid),
        type VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        from_name VARCHAR(255),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact_requests (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(50),
        organization VARCHAR(255),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS live_sessions (
        id SERIAL PRIMARY KEY,
        room_name VARCHAR(255) UNIQUE NOT NULL,
        room_url TEXT NOT NULL,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'webinaire',
        host_id VARCHAR(255) REFERENCES users(uid),
        host_name VARCHAR(255),
        host_avatar VARCHAR(255),
        participant_count INT DEFAULT 0,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id VARCHAR(255) REFERENCES users(uid),
        receiver_id VARCHAR(255) REFERENCES users(uid),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(uid),
        subscription JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE connections DROP COLUMN id;
          ALTER TABLE connections ADD COLUMN id SERIAL PRIMARY KEY;
        EXCEPTION
          WHEN others THEN null;
        END;
      END $$;
    `),console.log("[DB] Tables initialized successfully")}finally{e.release()}}catch(e){console.error("[DB] Initialization error:",e)}};s()}catch(e){s(e)}})},7077:(e,t,r)=>{r.d(t,{Sg:()=>E,cO:()=>o,gi:()=>i});let s=r(56742).createTransport({host:"smtp.gmail.com",port:587,secure:!1,auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}});async function E(e,t){await s.sendMail({from:`"Bourse du Temps" <${process.env.EMAIL_USER}>`,to:e,subject:"Votre code de v\xe9rification",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Bourse du Temps - Code de v\xe9rification</h2>
        <p>Votre code de connexion est :</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${t}
        </div>
        <p>Ce code est valable pendant <strong>10 minutes</strong>.</p>
        <p style="color: #6b7280; font-size: 12px;">Si vous n'avez pas demand\xe9 ce code, ignorez cet email.</p>
      </div>
    `})}async function i(e,t,r=""){await s.sendMail({from:`"Bourse du Temps" <${process.env.EMAIL_USER}>`,to:t,subject:"Accus\xe9 de r\xe9ception - Bourse du Temps",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #2563eb; font-size: 24px; margin: 0;">Bourse du Temps</h1>
        </div>
        <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="color: #1e293b; font-size: 16px;">Bonjour <strong>${e}</strong>,</p>
          <p style="color: #475569;">Nous avons bien re\xe7u votre message${r?` concernant "<strong>${r}</strong>"`:""} et nous vous r\xe9pondrons dans les plus brefs d\xe9lais.</p>
          <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;">Notre \xe9quipe traite g\xe9n\xe9ralement les demandes sous <strong>24 \xe0 48 heures</strong>.</p>
          </div>
          <p style="color: #475569;">Cordialement,<br><strong>L'\xe9quipe Bourse du Temps</strong></p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 16px;">Cet email a \xe9t\xe9 envoy\xe9 automatiquement, merci de ne pas y r\xe9pondre directement.</p>
      </div>
    `})}async function o(e,t,r,E,i,o){let a=process.env.EMAIL_USER;a&&await s.sendMail({from:`"Bourse du Temps" <${a}>`,to:a,subject:`Nouveau message de contact : ${i||"Sans sujet"}`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1e293b;">Nouveau message de contact</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; color: #475569; width: 130px;">Nom</td><td style="padding: 8px; color: #1e293b;">${e}</td></tr>
          <tr style="background:#f8fafc"><td style="padding: 8px; font-weight: bold; color: #475569;">Email</td><td style="padding: 8px; color: #1e293b;">${t}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #475569;">WhatsApp</td><td style="padding: 8px; color: #1e293b;">${r||"-"}</td></tr>
          <tr style="background:#f8fafc"><td style="padding: 8px; font-weight: bold; color: #475569;">Organisation</td><td style="padding: 8px; color: #1e293b;">${E||"-"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #475569;">Sujet</td><td style="padding: 8px; color: #1e293b;">${i||"-"}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="font-weight: bold; color: #475569; margin: 0 0 8px;">Message :</p>
          <p style="color: #1e293b; white-space: pre-wrap; margin: 0;">${o}</p>
        </div>
      </div>
    `})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[7787,4833,6742],()=>r(96373));module.exports=s})();