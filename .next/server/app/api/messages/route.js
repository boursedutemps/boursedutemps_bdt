"use strict";(()=>{var e={};e.id=7217,e.ids=[7217],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},10732:(e,t,E)=>{E.a(e,async(e,r)=>{try{E.r(t),E.d(t,{originalPathname:()=>c,patchFetch:()=>R,requestAsyncStorage:()=>n,routeModule:()=>o,serverHooks:()=>N,staticGenerationAsyncStorage:()=>u});var s=E(73278),A=E(45002),a=E(54877),T=E(15833),i=e([T]);T=(i.then?(await i)():i)[0];let o=new s.AppRouteRouteModule({definition:{kind:A.x.APP_ROUTE,page:"/api/messages/route",pathname:"/api/messages",filename:"route",bundlePath:"app/api/messages/route"},resolvedPagePath:"P:\\boursedutemps\\app\\api\\messages\\route.ts",nextConfigOutput:"",userland:T}),{requestAsyncStorage:n,staticGenerationAsyncStorage:u,serverHooks:N}=o,c="/api/messages/route";function R(){return(0,a.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:u})}r()}catch(e){r(e)}})},15833:(e,t,E)=>{E.a(e,async(e,r)=>{try{E.r(t),E.d(t,{GET:()=>R,POST:()=>o});var s=E(71309),A=E(1035),a=E(16910),T=E(57066),i=e([A,T]);async function R(e){let t=(0,a.b)(e);if(!t)return s.NextResponse.json({error:"Unauthorized"},{status:401});try{let e=(await (0,A.IO)("SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created_at ASC",[t])).rows.map(e=>({id:e.id,senderId:e.sender_id,receiverId:e.receiver_id,content:e.content,timestamp:e.created_at,isRead:e.is_read||!1}));return s.NextResponse.json(e)}catch(e){return console.error("Error fetching messages:",e),s.NextResponse.json({error:"Internal Server Error"},{status:500})}}async function o(e){try{let t=await e.json(),E=await (0,A.IO)(`INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3) RETURNING id`,[t.senderId,t.receiverId,t.content]),r=await (0,A.IO)("SELECT first_name, last_name FROM users WHERE uid = $1",[t.senderId]),a=(r.rowCount??0)>0?`${r.rows[0].first_name} ${r.rows[0].last_name}`:"Quelqu'un";return await (0,T.z)(t.receiverId,{title:`Nouveau message de ${a}`,body:t.content.length>50?t.content.substring(0,47)+"...":t.content,url:"/profile?chat="+t.senderId}),s.NextResponse.json({id:E.rows[0].id})}catch(e){return console.error("Error creating message:",e),s.NextResponse.json({error:"Internal Server Error"},{status:500})}}[A,T]=i.then?(await i)():i,r()}catch(e){r(e)}})},16910:(e,t,E)=>{E.d(t,{b:()=>s});let r=(0,E(30311).eI)("https://ikhutkwtaqpdiosatros.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);async function s(e){let t=e.headers.get("authorization");if(!t?.startsWith("Bearer "))return null;let E=t.replace("Bearer ","").trim();if(!E)return null;let{data:s,error:A}=await r.auth.getUser(E);return A||!s?.user?null:s.user.id}},1035:(e,t,E)=>{E.a(e,async(e,r)=>{try{E.d(t,{IO:()=>o});var s=E(8678),A=e([s]);s=(A.then?(await A)():A)[0];let a="postgres://mock:mock@localhost:5432/mock",T=!0;if(process.env.DATABASE_URL)try{new URL(process.env.DATABASE_URL),a=process.env.DATABASE_URL,T=!1,console.log("[DB] DATABASE_URL is set and valid.")}catch(e){console.error("[DB] Invalid DATABASE_URL format. Falling back to mock URL for build/safety.")}else console.warn("========================================================="),console.warn("WARNING: DATABASE_URL environment variable is missing."),console.warn("Using a mock URL for build purposes."),console.warn("=========================================================");let i=new s.default.Pool({connectionString:a,ssl:!a.includes("localhost")&&{rejectUnauthorized:!1},connectionTimeoutMillis:5e3}),R=!1,o=async(e,t)=>{if(T)return console.warn(`[DB] Mock mode active. Returning empty result for query: ${e.substring(0,50)}...`),{rows:[],rowCount:0};if(!i)throw Error("Database pool not initialized");return R||-1!==e.toLowerCase().indexOf("create table")||-1!==e.toLowerCase().indexOf("alter table")||(await n(),R=!0),await i.query(e,t)},n=async()=>{if(i&&!T)try{let e=await i.connect();try{await e.query(`
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
    `),console.log("[DB] Tables initialized successfully")}finally{e.release()}}catch(e){console.error("[DB] Initialization error:",e)}};r()}catch(e){r(e)}})},57066:(e,t,E)=>{E.a(e,async(e,r)=>{try{E.d(t,{z:()=>i});var s=E(81417),A=E.n(s),a=E(1035),T=e([a]);a=(T.then?(await T)():T)[0];let R="BOOjzEAlzHiAsL2VzMlaRP502Vn3CcRiEGtdv1q-Jc_-TTm_Xicq8aKyXkhEevQVChZN5sRqho2bpq2aDEv2Q6I",o=process.env.VAPID_PRIVATE_KEY,n=process.env.VAPID_EMAIL||"mailto:example@yourdomain.com";if(!n||n.startsWith("mailto:")||n.startsWith("http")||(n=`mailto:${n}`),R&&o)try{A().setVapidDetails(n,R,o)}catch(e){console.error("Error setting VAPID details:",e)}async function i(e,t){try{let E=await (0,a.IO)("SELECT subscription FROM push_subscriptions WHERE user_id = $1",[e]);if((E.rowCount??0)===0){console.log(`No push subscription found for user ${e}`);return}let r=E.rows.map(async E=>{let r=E.subscription;try{await A().sendNotification(r,JSON.stringify(t))}catch(t){410===t.statusCode||404===t.statusCode?(console.log(`Removing expired subscription for user ${e}`),await (0,a.IO)("DELETE FROM push_subscriptions WHERE user_id = $1 AND subscription = $2",[e,JSON.stringify(r)])):console.error("Error sending push notification:",t)}});await Promise.all(r)}catch(e){console.error("Error in sendPushNotification:",e)}}r()}catch(e){r(e)}})}};var t=require("../../../webpack-runtime.js");t.C(e);var E=e=>t(t.s=e),r=t.X(0,[7787,4833,311,1417],()=>E(10732));module.exports=r})();