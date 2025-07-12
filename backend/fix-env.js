const fs = require('fs');

console.log('🔧 Fixing .env file...\n');

const envPath = './.env';
let envContent = fs.readFileSync(envPath, 'utf8');

// Fix the MongoDB URI
const currentUri = 'mongodb+srv://PROJECT:APEXARS@stacklt.o7olesz.mongodb.net/?retryWrites=true&w=majority&appName=Stacklt';
const fixedUri = 'mongodb+srv://PROJECT:APEXARS@stacklt.o7olesz.mongodb.net/qa_app?retryWrites=true&w=majority&appName=Stacklt';

// Replace MONGODB_URI with MONGO_URI and fix the connection string
envContent = envContent.replace(/MONGODB_URI=.*/, `MONGO_URI=${fixedUri}`);

fs.writeFileSync(envPath, envContent);

console.log('✅ .env file fixed!');
console.log('📝 Updated MONGO_URI with database name: /qa_app');
console.log('🔄 Restarting server...\n');

console.log('Your connection string is now:');
console.log(fixedUri);
console.log('\n🎉 The server should now connect to MongoDB Atlas!'); 