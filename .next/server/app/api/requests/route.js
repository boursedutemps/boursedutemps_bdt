"use strict";(()=>{var e={};e.id=5303,e.ids=[5303],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},22934:(e,E,t)=>{t.a(e,async(e,s)=>{try{t.r(E),t.d(E,{originalPathname:()=>L,patchFetch:()=>i,requestAsyncStorage:()=>n,routeModule:()=>o,serverHooks:()=>N,staticGenerationAsyncStorage:()=>u});var r=t(73278),A=t(45002),R=t(54877),T=t(48346),a=e([T]);T=(a.then?(await a)():a)[0];let o=new r.AppRouteRouteModule({definition:{kind:A.x.APP_ROUTE,page:"/api/requests/route",pathname:"/api/requests",filename:"route",bundlePath:"app/api/requests/route"},resolvedPagePath:"P:\\boursedutemps\\app\\api\\requests\\route.ts",nextConfigOutput:"",userland:T}),{requestAsyncStorage:n,staticGenerationAsyncStorage:u,serverHooks:N}=o,L="/api/requests/route";function i(){return(0,R.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:u})}s()}catch(e){s(e)}})},48346:(e,E,t)=>{t.a(e,async(e,s)=>{try{t.r(E),t.d(E,{GET:()=>a,PATCH:()=>o,POST:()=>i});var r=t(71309),A=t(16910),R=t(1035),T=e([R]);async function a(e){let{searchParams:E}=new URL(e.url),t=E.get("type"),s=await (0,A.b)(e);if("sent"===t){if(!s)return r.NextResponse.json({error:"Non autoris\xe9"},{status:401});let e=await (0,R.IO)(`SELECT r.*, s.title as service_title, u.name as provider_name
       FROM requests r
       JOIN services s ON r.service_id = s.id
       JOIN users u ON r.provider_id = u.id
       WHERE r.requester_id = $1 ORDER BY r.created_at DESC`,[s]);return r.NextResponse.json(e.rows)}if("received"===t){if(!s)return r.NextResponse.json({error:"Non autoris\xe9"},{status:401});let e=await (0,R.IO)(`SELECT r.*, s.title as service_title, u.name as requester_name
       FROM requests r
       JOIN services s ON r.service_id = s.id
       JOIN users u ON r.requester_id = u.id
       WHERE r.provider_id = $1 ORDER BY r.created_at DESC`,[s]);return r.NextResponse.json(e.rows)}let T=await (0,R.IO)(`SELECT r.*, s.title as service_title FROM requests r
     JOIN services s ON r.service_id = s.id
     WHERE r.status = 'pending' ORDER BY r.created_at DESC`);return r.NextResponse.json(T.rows)}async function i(e){let E=await (0,A.b)(e);if(!E)return r.NextResponse.json({error:"Non autoris\xe9"},{status:401});let{service_id:t,message:s}=await e.json();if(!t)return r.NextResponse.json({error:"service_id requis"},{status:400});let T=await (0,R.IO)("SELECT user_id FROM services WHERE id = $1",[t]);if(0===T.rows.length)return r.NextResponse.json({error:"Service introuvable"},{status:404});let a=T.rows[0].user_id;if(a===E)return r.NextResponse.json({error:"Vous ne pouvez pas vous contacter vous-m\xeame"},{status:400});let i=await (0,R.IO)(`INSERT INTO requests (service_id, requester_id, provider_id, message, status, created_at)
     VALUES ($1, $2, $3, $4, 'pending', NOW()) RETURNING *`,[t,E,a,s??""]);return r.NextResponse.json(i.rows[0],{status:201})}async function o(e){let E=await (0,A.b)(e);if(!E)return r.NextResponse.json({error:"Non autoris\xe9"},{status:401});let{id:t,status:s}=await e.json();if(!t||!s)return r.NextResponse.json({error:"id et status requis"},{status:400});let T=await (0,R.IO)("SELECT provider_id FROM requests WHERE id = $1",[t]);return 0===T.rows.length?r.NextResponse.json({error:"Introuvable"},{status:404}):T.rows[0].provider_id!==E?r.NextResponse.json({error:"Interdit"},{status:403}):(await (0,R.IO)("UPDATE requests SET status = $1 WHERE id = $2",[s,t]),r.NextResponse.json({success:!0}))}R=(T.then?(await T)():T)[0],s()}catch(e){s(e)}})},16910:(e,E,t)=>{t.d(E,{b:()=>r});let s=(0,t(30311).eI)("https://ikhutkwtaqpdiosatros.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);async function r(e){let E=e.headers.get("authorization");if(!E?.startsWith("Bearer "))return null;let t=E.replace("Bearer ","").trim();if(!t)return null;let{data:r,error:A}=await s.auth.getUser(t);return A||!r?.user?null:r.user.id}},1035:(e,E,t)=>{t.a(e,async(e,s)=>{try{t.d(E,{IO:()=>o});var r=t(8678),A=e([r]);r=(A.then?(await A)():A)[0];let R="postgres://mock:mock@localhost:5432/mock",T=!0;if(process.env.DATABASE_URL)try{new URL(process.env.DATABASE_URL),R=process.env.DATABASE_URL,T=!1,console.log("[DB] DATABASE_URL is set and valid.")}catch(e){console.error("[DB] Invalid DATABASE_URL format. Falling back to mock URL for build/safety.")}else console.warn("========================================================="),console.warn("WARNING: DATABASE_URL environment variable is missing."),console.warn("Using a mock URL for build purposes."),console.warn("=========================================================");let a=new r.default.Pool({connectionString:R,ssl:!R.includes("localhost")&&{rejectUnauthorized:!1},connectionTimeoutMillis:5e3}),i=!1,o=async(e,E)=>{if(T)return console.warn(`[DB] Mock mode active. Returning empty result for query: ${e.substring(0,50)}...`),{rows:[],rowCount:0};if(!a)throw Error("Database pool not initialized");return i||-1!==e.toLowerCase().indexOf("create table")||-1!==e.toLowerCase().indexOf("alter table")||(await n(),i=!0),await a.query(e,E)},n=async()=>{if(a&&!T)try{let e=await a.connect();try{await e.query(`
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
    `),console.log("[DB] Tables initialized successfully")}finally{e.release()}}catch(e){console.error("[DB] Initialization error:",e)}};s()}catch(e){s(e)}})}};var E=require("../../../webpack-runtime.js");E.C(e);var t=e=>E(E.s=e),s=E.X(0,[7787,4833,311],()=>t(22934));module.exports=s})();