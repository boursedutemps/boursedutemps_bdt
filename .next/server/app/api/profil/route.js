"use strict";(()=>{var e={};e.id=8143,e.ids=[8143],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},84770:e=>{e.exports=require("crypto")},8678:e=>{e.exports=import("pg")},42030:(e,E,t)=>{t.a(e,async(e,r)=>{try{t.r(E),t.d(E,{originalPathname:()=>N,patchFetch:()=>R,requestAsyncStorage:()=>n,routeModule:()=>o,serverHooks:()=>l,staticGenerationAsyncStorage:()=>u});var s=t(73278),A=t(45002),a=t(54877),T=t(60973),i=e([T]);T=(i.then?(await i)():i)[0];let o=new s.AppRouteRouteModule({definition:{kind:A.x.APP_ROUTE,page:"/api/profil/route",pathname:"/api/profil",filename:"route",bundlePath:"app/api/profil/route"},resolvedPagePath:"P:\\boursedutemps\\app\\api\\profil\\route.ts",nextConfigOutput:"",userland:T}),{requestAsyncStorage:n,staticGenerationAsyncStorage:u,serverHooks:l}=o,N="/api/profil/route";function R(){return(0,a.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:u})}r()}catch(e){r(e)}})},60973:(e,E,t)=>{t.a(e,async(e,r)=>{try{t.r(E),t.d(E,{POST:()=>o});var s=t(71309),A=t(1035),a=t(16910),T=t(93981),i=t(21063),R=e([A]);async function o(e){let{email:E,emailCode:t,password:r,firstName:R,lastName:o,department:n,gender:u,country:l,whatsapp:N,offeredSkills:L,requestedSkills:d,availability:c,languages:C,avatar:I}=await e.json();if(!E||!r||!R||!o)return s.NextResponse.json({error:"Champs requis manquants"},{status:400});try{if(t){let e=await (0,A.IO)("SELECT * FROM otps WHERE identifier = $1 AND code = $2 AND expires_at > NOW()",[E,t]);if(!e.rowCount||0===e.rowCount)return s.NextResponse.json({error:"Code de v\xe9rification invalide ou expir\xe9."},{status:401})}if(((await (0,A.IO)("SELECT * FROM users WHERE email = $1",[E])).rowCount??0)>0)return s.NextResponse.json({error:"Cet email est d\xe9j\xe0 utilis\xe9"},{status:400});let e=await T.ZP.hash(r,10),U=(0,i.Z)(),S=E===process.env.ADMIN_EMAIL?"admin":"user";await (0,A.IO)(`INSERT INTO users (
        uid, email, password, first_name, last_name, whatsapp, department, gender, country,
        availability, languages, offered_skills, requested_skills, avatar, terms_accepted, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,[U,E,e,R,o,N,n,u,l,c,JSON.stringify(C||[]),JSON.stringify(L||[]),JSON.stringify(d||[]),I,!0,S]),t&&await (0,A.IO)("DELETE FROM otps WHERE identifier = $1",[E]);let _=(0,a.signToken)({uid:U,email:E}),p=(await (0,A.IO)("SELECT * FROM users WHERE uid = $1",[U])).rows[0],O={id:p.uid,uid:p.uid,firstName:p.first_name,lastName:p.last_name,email:p.email,department:p.department,whatsapp:p.whatsapp,gender:p.gender,country:p.country,bio:p.bio,offeredSkills:p.offered_skills||[],requestedSkills:p.requested_skills||[],availability:p.availability,languages:p.languages||[],credits:p.credits,avatar:p.avatar,coverPhoto:p.cover_photo,role:p.role,status:p.status,createdAt:p.created_at};return s.NextResponse.json({token:_,user:O})}catch(e){return console.error("Profil registration error:",e),s.NextResponse.json({error:"Erreur lors de l'inscription"},{status:500})}}A=(R.then?(await R)():R)[0],r()}catch(e){r(e)}})},16910:(e,E,t)=>{t.d(E,{b:()=>s});let r=(0,t(30311).eI)("https://ikhutkwtaqpdiosatros.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);async function s(e){let E=e.headers.get("authorization");if(!E?.startsWith("Bearer "))return null;let t=E.replace("Bearer ","").trim();if(!t)return null;let{data:s,error:A}=await r.auth.getUser(t);return A||!s?.user?null:s.user.id}},1035:(e,E,t)=>{t.a(e,async(e,r)=>{try{t.d(E,{IO:()=>o});var s=t(8678),A=e([s]);s=(A.then?(await A)():A)[0];let a="postgres://mock:mock@localhost:5432/mock",T=!0;if(process.env.DATABASE_URL)try{new URL(process.env.DATABASE_URL),a=process.env.DATABASE_URL,T=!1,console.log("[DB] DATABASE_URL is set and valid.")}catch(e){console.error("[DB] Invalid DATABASE_URL format. Falling back to mock URL for build/safety.")}else console.warn("========================================================="),console.warn("WARNING: DATABASE_URL environment variable is missing."),console.warn("Using a mock URL for build purposes."),console.warn("=========================================================");let i=new s.default.Pool({connectionString:a,ssl:!a.includes("localhost")&&{rejectUnauthorized:!1},connectionTimeoutMillis:5e3}),R=!1,o=async(e,E)=>{if(T)return console.warn(`[DB] Mock mode active. Returning empty result for query: ${e.substring(0,50)}...`),{rows:[],rowCount:0};if(!i)throw Error("Database pool not initialized");return R||-1!==e.toLowerCase().indexOf("create table")||-1!==e.toLowerCase().indexOf("alter table")||(await n(),R=!0),await i.query(e,E)},n=async()=>{if(i&&!T)try{let e=await i.connect();try{await e.query(`
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
    `),console.log("[DB] Tables initialized successfully")}finally{e.release()}}catch(e){console.error("[DB] Initialization error:",e)}};r()}catch(e){r(e)}})},21063:(e,E,t)=>{t.d(E,{Z:()=>i});let r=require("node:crypto"),s={randomUUID:r.randomUUID},A=new Uint8Array(256),a=A.length,T=[];for(let e=0;e<256;++e)T.push((e+256).toString(16).slice(1));let i=function(e,E,t){return!s.randomUUID||E||e?function(e,E,t){let s=(e=e||{}).random??e.rng?.()??(a>A.length-16&&((0,r.randomFillSync)(A),a=0),A.slice(a,a+=16));if(s.length<16)throw Error("Random bytes length must be >= 16");if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,E){if((t=t||0)<0||t+16>E.length)throw RangeError(`UUID byte range ${t}:${t+15} is out of buffer bounds`);for(let e=0;e<16;++e)E[t+e]=s[e];return E}return function(e,E=0){return(T[e[E+0]]+T[e[E+1]]+T[e[E+2]]+T[e[E+3]]+"-"+T[e[E+4]]+T[e[E+5]]+"-"+T[e[E+6]]+T[e[E+7]]+"-"+T[e[E+8]]+T[e[E+9]]+"-"+T[e[E+10]]+T[e[E+11]]+T[e[E+12]]+T[e[E+13]]+T[e[E+14]]+T[e[E+15]]).toLowerCase()}(s)}(e,E,t):s.randomUUID()}}};var E=require("../../../webpack-runtime.js");E.C(e);var t=e=>E(E.s=e),r=E.X(0,[7787,4833,311,3981],()=>t(42030));module.exports=r})();