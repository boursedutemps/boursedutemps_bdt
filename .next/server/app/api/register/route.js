"use strict";(()=>{var e={};e.id=5569,e.ids=[5569],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},84770:e=>{e.exports=require("crypto")},8678:e=>{e.exports=import("pg")},95846:(e,E,t)=>{t.a(e,async(e,r)=>{try{t.r(E),t.d(E,{originalPathname:()=>l,patchFetch:()=>i,requestAsyncStorage:()=>o,routeModule:()=>n,serverHooks:()=>u,staticGenerationAsyncStorage:()=>N});var A=t(73278),s=t(45002),T=t(54877),R=t(77007),a=e([R]);R=(a.then?(await a)():a)[0];let n=new A.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/register/route",pathname:"/api/register",filename:"route",bundlePath:"app/api/register/route"},resolvedPagePath:"P:\\boursedutemps\\app\\api\\register\\route.ts",nextConfigOutput:"",userland:R}),{requestAsyncStorage:o,staticGenerationAsyncStorage:N,serverHooks:u}=n,l="/api/register/route";function i(){return(0,T.patchFetch)({serverHooks:u,staticGenerationAsyncStorage:N})}r()}catch(e){r(e)}})},77007:(e,E,t)=>{t.a(e,async(e,r)=>{try{t.r(E),t.d(E,{POST:()=>n});var A=t(71309),s=t(1035),T=t(16910),R=t(93981),a=t(21063),i=e([s]);async function n(e){let{email:E,emailCode:t,password:r,firstName:i,lastName:n,department:o,gender:N,country:u,whatsapp:l,offeredSkills:L,requestedSkills:d,availability:c,languages:C,avatar:I}=await e.json();if(!E||!t||!r||!i||!n)return A.NextResponse.json({error:"Champs requis manquants"},{status:400});try{let e=await (0,s.IO)("SELECT * FROM otps WHERE identifier = $1 AND code = $2 AND expires_at > NOW()",[E,t]);if(!e.rowCount||0===e.rowCount)return A.NextResponse.json({error:"Code de v\xe9rification invalide ou expir\xe9."},{status:401});if(((await (0,s.IO)("SELECT * FROM users WHERE email = $1",[E])).rowCount??0)>0)return A.NextResponse.json({error:"Cet email est d\xe9j\xe0 utilis\xe9"},{status:400});let U=await R.ZP.hash(r,10),S=(0,a.Z)(),_="jeanbernardpierrelouis@gmail.com"===E?"admin":"user";await (0,s.IO)(`INSERT INTO users (
        uid, email, password, first_name, last_name, whatsapp, department, gender, country,
        availability, languages, offered_skills, requested_skills, avatar, terms_accepted, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,[S,E,U,i,n,l,o,N,u,c,JSON.stringify(C),JSON.stringify(L),JSON.stringify(d),I,!0,_]),await (0,s.IO)("DELETE FROM otps WHERE identifier = $1",[E]);let O=(0,T.signToken)({uid:S,email:E});return A.NextResponse.json({token:O,uid:S})}catch(e){return console.error("Registration error:",e),A.NextResponse.json({error:"Erreur lors de l'inscription"},{status:500})}}s=(i.then?(await i)():i)[0],r()}catch(e){r(e)}})},16910:(e,E,t)=>{t.d(E,{b:()=>A});let r=(0,t(30311).eI)("https://ikhutkwtaqpdiosatros.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);async function A(e){let E=e.headers.get("authorization");if(!E?.startsWith("Bearer "))return null;let t=E.replace("Bearer ","").trim();if(!t)return null;let{data:A,error:s}=await r.auth.getUser(t);return s||!A?.user?null:A.user.id}},1035:(e,E,t)=>{t.a(e,async(e,r)=>{try{t.d(E,{IO:()=>n});var A=t(8678),s=e([A]);A=(s.then?(await s)():s)[0];let T="postgres://mock:mock@localhost:5432/mock",R=!0;if(process.env.DATABASE_URL)try{new URL(process.env.DATABASE_URL),T=process.env.DATABASE_URL,R=!1,console.log("[DB] DATABASE_URL is set and valid.")}catch(e){console.error("[DB] Invalid DATABASE_URL format. Falling back to mock URL for build/safety.")}else console.warn("========================================================="),console.warn("WARNING: DATABASE_URL environment variable is missing."),console.warn("Using a mock URL for build purposes."),console.warn("=========================================================");let a=new A.default.Pool({connectionString:T,ssl:!T.includes("localhost")&&{rejectUnauthorized:!1},connectionTimeoutMillis:5e3}),i=!1,n=async(e,E)=>{if(R)return console.warn(`[DB] Mock mode active. Returning empty result for query: ${e.substring(0,50)}...`),{rows:[],rowCount:0};if(!a)throw Error("Database pool not initialized");return i||-1!==e.toLowerCase().indexOf("create table")||-1!==e.toLowerCase().indexOf("alter table")||(await o(),i=!0),await a.query(e,E)},o=async()=>{if(a&&!R)try{let e=await a.connect();try{await e.query(`
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
    `),console.log("[DB] Tables initialized successfully")}finally{e.release()}}catch(e){console.error("[DB] Initialization error:",e)}};r()}catch(e){r(e)}})},21063:(e,E,t)=>{t.d(E,{Z:()=>a});let r=require("node:crypto"),A={randomUUID:r.randomUUID},s=new Uint8Array(256),T=s.length,R=[];for(let e=0;e<256;++e)R.push((e+256).toString(16).slice(1));let a=function(e,E,t){return!A.randomUUID||E||e?function(e,E,t){let A=(e=e||{}).random??e.rng?.()??(T>s.length-16&&((0,r.randomFillSync)(s),T=0),s.slice(T,T+=16));if(A.length<16)throw Error("Random bytes length must be >= 16");if(A[6]=15&A[6]|64,A[8]=63&A[8]|128,E){if((t=t||0)<0||t+16>E.length)throw RangeError(`UUID byte range ${t}:${t+15} is out of buffer bounds`);for(let e=0;e<16;++e)E[t+e]=A[e];return E}return function(e,E=0){return(R[e[E+0]]+R[e[E+1]]+R[e[E+2]]+R[e[E+3]]+"-"+R[e[E+4]]+R[e[E+5]]+"-"+R[e[E+6]]+R[e[E+7]]+"-"+R[e[E+8]]+R[e[E+9]]+"-"+R[e[E+10]]+R[e[E+11]]+R[e[E+12]]+R[e[E+13]]+R[e[E+14]]+R[e[E+15]]).toLowerCase()}(A)}(e,E,t):A.randomUUID()}}};var E=require("../../../webpack-runtime.js");E.C(e);var t=e=>E(E.s=e),r=E.X(0,[7787,4833,311,3981],()=>t(95846));module.exports=r})();