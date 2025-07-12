const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 MongoDB Atlas Setup Helper\n');

rl.question('Enter your MongoDB Atlas connection string: ', (connectionString) => {
  const envPath = './.env';
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace the MONGO_URI line
  envContent = envContent.replace(
    /MONGO_URI=.*/,
    `MONGO_URI=${connectionString}`
  );
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ .env file updated successfully!');
  console.log('🔄 Please restart your backend server: npm run dev');
  
  rl.close();
}); 