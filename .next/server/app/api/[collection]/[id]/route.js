"use strict";(()=>{var e={};e.id=4778,e.ids=[4778],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},19801:e=>{e.exports=require("os")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},74175:e=>{e.exports=require("tty")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},8678:e=>{e.exports=import("pg")},77225:(e,t,E)=>{E.a(e,async(e,r)=>{try{E.r(t),E.d(t,{originalPathname:()=>l,patchFetch:()=>a,requestAsyncStorage:()=>n,routeModule:()=>R,serverHooks:()=>c,staticGenerationAsyncStorage:()=>u});var s=E(73278),i=E(45002),A=E(54877),o=E(20691),T=e([o]);o=(T.then?(await T)():T)[0];let R=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/[collection]/[id]/route",pathname:"/api/[collection]/[id]",filename:"route",bundlePath:"app/api/[collection]/[id]/route"},resolvedPagePath:"P:\\boursedutemps\\app\\api\\[collection]\\[id]\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:n,staticGenerationAsyncStorage:u,serverHooks:c}=R,l="/api/[collection]/[id]/route";function a(){return(0,A.patchFetch)({serverHooks:c,staticGenerationAsyncStorage:u})}r()}catch(e){r(e)}})},20691:(e,t,E)=>{E.a(e,async(e,r)=>{try{E.r(t),E.d(t,{DELETE:()=>R,GET:()=>T,PATCH:()=>a});var s=E(71309),i=E(1035),A=E(57066),o=e([i,A]);[i,A]=o.then?(await o)():o;let n=e=>e.replace(/[A-Z]/g,e=>`_${e.toLowerCase()}`);async function T(e,{params:t}){let{collection:E,id:r}=t,A="forumTopics"===E?"forum_topics":E;try{let e=await (0,i.IO)(`SELECT * FROM ${A} WHERE ${"users"===A?"uid":"id"} = $1`,[r]);if((e.rowCount??0)===0)return s.NextResponse.json({error:"Not found"},{status:404});let t=e.rows[0],E={};for(let e in t)E[e.replace(/_([a-z])/g,e=>e[1].toUpperCase())]=t[e];return E.uid&&(E.id=E.uid),s.NextResponse.json(E)}catch(e){return console.error(`Error fetching ${E}/${r}:`,e),s.NextResponse.json({error:"Internal Server Error"},{status:500})}}async function a(e,{params:t}){let{collection:E,id:r}=t,o="forumTopics"===E?"forum_topics":E;try{let t=await e.json(),T=Object.keys(t);if(0===T.length)return s.NextResponse.json({error:"No data provided"},{status:400});let a=T.map((e,t)=>`${n(e)} = $${t+1}`).join(", "),R=Object.values(t);if(await (0,i.IO)(`UPDATE ${o} SET ${a} WHERE ${"users"===o?"uid":"id"} = $${T.length+1}`,[...R,r]),"services"===E&&"accepted"===t.status){let e=await (0,i.IO)("SELECT user_id, title FROM services WHERE id = $1",[r]);if((e.rowCount??0)>0){let t=e.rows[0];await (0,A.z)(t.user_id,{title:"Service accept\xe9",body:`Votre service "${t.title}" a \xe9t\xe9 accept\xe9 !`,url:"/services"})}}else if("requests"===E&&"accepted"===t.status){let e=await (0,i.IO)("SELECT user_id, title FROM requests WHERE id = $1",[r]);if((e.rowCount??0)>0){let t=e.rows[0];await (0,A.z)(t.user_id,{title:"Demande accept\xe9e",body:`Votre demande "${t.title}" a \xe9t\xe9 accept\xe9e !`,url:"/requests"})}}else if("connections"===E&&"accepted"===t.status){let e=await (0,i.IO)("SELECT sender_id FROM connections WHERE id = $1",[r]);if((e.rowCount??0)>0){let t=e.rows[0];await (0,A.z)(t.sender_id,{title:"Demande de connexion accept\xe9e",body:`Votre demande de connexion a \xe9t\xe9 accept\xe9e.`,url:"/profile"})}}return s.NextResponse.json({success:!0})}catch(e){return console.error(`Error updating ${E}/${r}:`,e),s.NextResponse.json({error:"Internal Server Error"},{status:500})}}async function R(e,{params:t}){let{collection:E,id:r}=t,A="forumTopics"===E?"forum_topics":E;try{return await (0,i.IO)(`DELETE FROM ${A} WHERE ${"users"===A?"uid":"id"} = $1`,[r]),s.NextResponse.json({success:!0})}catch(e){return console.error(`Error deleting ${E}/${r}:`,e),s.NextResponse.json({error:"Internal Server Error"},{status:500})}}r()}catch(e){r(e)}})},1035:(e,t,E)=>{E.a(e,async(e,r)=>{try{E.d(t,{IO:()=>R});var s=E(8678),i=e([s]);s=(i.then?(await i)():i)[0];let A="postgres://mock:mock@localhost:5432/mock",o=!0;if(process.env.DATABASE_URL)try{new URL(process.env.DATABASE_URL),A=process.env.DATABASE_URL,o=!1,console.log("[DB] DATABASE_URL is set and valid.")}catch(e){console.error("[DB] Invalid DATABASE_URL format. Falling back to mock URL for build/safety.")}else console.warn("========================================================="),console.warn("WARNING: DATABASE_URL environment variable is missing."),console.warn("Using a mock URL for build purposes."),console.warn("=========================================================");let T=new s.default.Pool({connectionString:A,ssl:!A.includes("localhost")&&{rejectUnauthorized:!1},connectionTimeoutMillis:5e3}),a=!1,R=async(e,t)=>{if(o)return console.warn(`[DB] Mock mode active. Returning empty result for query: ${e.substring(0,50)}...`),{rows:[],rowCount:0};if(!T)throw Error("Database pool not initialized");return a||-1!==e.toLowerCase().indexOf("create table")||-1!==e.toLowerCase().indexOf("alter table")||(await n(),a=!0),await T.query(e,t)},n=async()=>{if(T&&!o)try{let e=await T.connect();try{await e.query(`
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
    `),console.log("[DB] Tables initialized successfully")}finally{e.release()}}catch(e){console.error("[DB] Initialization error:",e)}};r()}catch(e){r(e)}})},57066:(e,t,E)=>{E.a(e,async(e,r)=>{try{E.d(t,{z:()=>T});var s=E(81417),i=E.n(s),A=E(1035),o=e([A]);A=(o.then?(await o)():o)[0];let a="BOOjzEAlzHiAsL2VzMlaRP502Vn3CcRiEGtdv1q-Jc_-TTm_Xicq8aKyXkhEevQVChZN5sRqho2bpq2aDEv2Q6I",R=process.env.VAPID_PRIVATE_KEY,n=process.env.VAPID_EMAIL||"mailto:example@yourdomain.com";if(!n||n.startsWith("mailto:")||n.startsWith("http")||(n=`mailto:${n}`),a&&R)try{i().setVapidDetails(n,a,R)}catch(e){console.error("Error setting VAPID details:",e)}async function T(e,t){try{let E=await (0,A.IO)("SELECT subscription FROM push_subscriptions WHERE user_id = $1",[e]);if((E.rowCount??0)===0){console.log(`No push subscription found for user ${e}`);return}let r=E.rows.map(async E=>{let r=E.subscription;try{await i().sendNotification(r,JSON.stringify(t))}catch(t){410===t.statusCode||404===t.statusCode?(console.log(`Removing expired subscription for user ${e}`),await (0,A.IO)("DELETE FROM push_subscriptions WHERE user_id = $1 AND subscription = $2",[e,JSON.stringify(r)])):console.error("Error sending push notification:",t)}});await Promise.all(r)}catch(e){console.error("Error in sendPushNotification:",e)}}r()}catch(e){r(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var E=e=>t(t.s=e),r=t.X(0,[7787,4833,1417],()=>E(77225));module.exports=r})();