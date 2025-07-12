const fs = require('fs');
const path = require('path');

const envContent = `MONGO_URI=mongodb://localhost:27017/qa_app
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
PORT=5000
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the JWT_SECRET with a secure random string');
} else {
  console.log('⚠️  .env file already exists');
}

console.log('\n🔧 To start the server:');
console.log('   npm run dev');
console.log('\n📋 Make sure MongoDB is running locally or update MONGO_URI for MongoDB Atlas'); 