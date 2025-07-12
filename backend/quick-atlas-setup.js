const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 QUICK MONGODB ATLAS SETUP\n');

console.log('📋 Follow these steps:');
console.log('1. Go to: https://www.mongodb.com/atlas');
console.log('2. Click "Try Free" and create account');
console.log('3. Create a FREE cluster (M0)');
console.log('4. In "Database Access" → Add New Database User');
console.log('5. In "Network Access" → Allow Access from Anywhere');
console.log('6. Click "Connect" → "Connect your application"');
console.log('7. Copy the connection string\n');

console.log('🔗 Your connection string should look like this:');
console.log('mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority\n');

console.log('⚠️  IMPORTANT: Replace "username", "password", and "cluster" with your actual values!');
console.log('⚠️  Also add "/qa_app" before the "?" to specify the database name\n');

console.log('📝 Example of what you should paste:');
console.log('mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/qa_app?retryWrites=true&w=majority\n');

rl.question('Paste your MongoDB Atlas connection string here: ', (connectionString) => {
  if (!connectionString.includes('mongodb+srv://')) {
    console.log('❌ Invalid connection string! Please make sure it starts with "mongodb+srv://"');
    rl.close();
    return;
  }

  // Make sure it has the database name
  if (!connectionString.includes('/qa_app')) {
    connectionString = connectionString.replace('?', '/qa_app?');
  }

  const envPath = './.env';
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace the MONGO_URI line
  envContent = envContent.replace(
    /MONGO_URI=.*/,
    `MONGO_URI=${connectionString}`
  );
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ .env file updated successfully!');
  console.log('🔄 Now restart your backend server:');
  console.log('   npm run dev');
  console.log('\n🎉 Your app should now work with MongoDB Atlas!');
  
  rl.close();
}); 