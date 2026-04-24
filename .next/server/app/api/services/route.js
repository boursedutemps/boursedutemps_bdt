"use strict";(()=>{var e={};e.id=84,e.ids=[84],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},40334:(e,E,t)=>{t.a(e,async(e,A)=>{try{t.r(E),t.d(E,{originalPathname:()=>L,patchFetch:()=>i,requestAsyncStorage:()=>n,routeModule:()=>o,serverHooks:()=>u,staticGenerationAsyncStorage:()=>N});var s=t(73278),T=t(45002),R=t(54877),r=t(39233),a=e([r]);r=(a.then?(await a)():a)[0];let o=new s.AppRouteRouteModule({definition:{kind:T.x.APP_ROUTE,page:"/api/services/route",pathname:"/api/services",filename:"route",bundlePath:"app/api/services/route"},resolvedPagePath:"P:\\boursedutemps\\app\\api\\services\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:n,staticGenerationAsyncStorage:N,serverHooks:u}=o,L="/api/services/route";function i(){return(0,R.patchFetch)({serverHooks:u,staticGenerationAsyncStorage:N})}A()}catch(e){A(e)}})},39233:(e,E,t)=>{t.a(e,async(e,A)=>{try{t.r(E),t.d(E,{DELETE:()=>o,GET:()=>a,POST:()=>i});var s=t(71309),T=t(16910),R=t(1035),r=e([R]);async function a(e){let{searchParams:E}=new URL(e.url),t=E.get("category"),A=E.get("userId"),T="SELECT s.*, u.name as author_name, u.avatar_url FROM services s JOIN users u ON s.user_id = u.id WHERE 1=1",r=[],a=1;t&&(T+=` AND s.category = $${a++}`,r.push(t)),A&&(T+=` AND s.user_id = $${a++}`,r.push(A)),T+=" ORDER BY s.created_at DESC";let i=await (0,R.IO)(T,r);return s.NextResponse.json(i.rows)}async function i(e){let E=await (0,T.b)(e);if(!E)return s.NextResponse.json({error:"Non autoris\xe9"},{status:401});let{title:t,description:A,category:r,duration:a,image_url:i}=await e.json();if(!t||!A||!r||!a)return s.NextResponse.json({error:"Champs manquants"},{status:400});let o=await (0,R.IO)(`INSERT INTO services (user_id, title, description, category, duration, image_url, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,[E,t,A,r,a,i??null]);return s.NextResponse.json(o.rows[0],{status:201})}async function o(e){let E=await (0,T.b)(e);if(!E)return s.NextResponse.json({error:"Non autoris\xe9"},{status:401});let{id:t}=await e.json(),A=await (0,R.IO)("SELECT user_id FROM services WHERE id = $1",[t]);return 0===A.rows.length?s.NextResponse.json({error:"Introuvable"},{status:404}):A.rows[0].user_id!==E?s.NextResponse.json({error:"Interdit"},{status:403}):(await (0,R.IO)("DELETE FROM services WHERE id = $1",[t]),s.NextResponse.json({success:!0}))}R=(r.then?(await r)():r)[0],A()}catch(e){A(e)}})},16910:(e,E,t)=>{t.d(E,{b:()=>s});let A=(0,t(30311).eI)("https://ikhutkwtaqpdiosatros.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);async function s(e){let E=e.headers.get("authorization");if(!E?.startsWith("Bearer "))return null;let t=E.replace("Bearer ","").trim();if(!t)return null;let{data:s,error:T}=await A.auth.getUser(t);return T||!s?.user?null:s.user.id}},1035:(e,E,t)=>{t.a(e,async(e,A)=>{try{t.d(E,{IO:()=>o});var s=t(8678),T=e([s]);s=(T.then?(await T)():T)[0];let R="postgres://mock:mock@localhost:5432/mock",r=!0;if(process.env.DATABASE_URL)try{new URL(process.env.DATABASE_URL),R=process.env.DATABASE_URL,r=!1,console.log("[DB] DATABASE_URL is set and valid.")}catch(e){console.error("[DB] Invalid DATABASE_URL format. Falling back to mock URL for build/safety.")}else console.warn("========================================================="),console.warn("WARNING: DATABASE_URL environment variable is missing."),console.warn("Using a mock URL for build purposes."),console.warn("=========================================================");let a=new s.default.Pool({connectionString:R,ssl:!R.includes("localhost")&&{rejectUnauthorized:!1},connectionTimeoutMillis:5e3}),i=!1,o=async(e,E)=>{if(r)return console.warn(`[DB] Mock mode active. Returning empty result for query: ${e.substring(0,50)}...`),{rows:[],rowCount:0};if(!a)throw Error("Database pool not initialized");return i||-1!==e.toLowerCase().indexOf("create table")||-1!==e.toLowerCase().indexOf("alter table")||(await n(),i=!0),await a.query(e,E)},n=async()=>{if(a&&!r)try{let e=await a.connect();try{await e.query(`
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
    `),console.log("[DB] Tables initialized successfully")}finally{e.release()}}catch(e){console.error("[DB] Initialization error:",e)}};A()}catch(e){A(e)}})}};var E=require("../../../webpack-runtime.js");E.C(e);var t=e=>E(E.s=e),A=E.X(0,[7787,4833,311],()=>t(40334));module.exports=A})();