import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/gigflow';

// Inline schemas for seed script (avoid circular deps)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'sales'], default: 'sales' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost'] },
  source: { type: String, enum: ['Website', 'Instagram', 'Referral'] },
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Lead = mongoose.model('Lead', LeadSchema);

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🧹 Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create users
    const [admin, sales1, sales2] = await User.insertMany([
      { name: 'Admin User', email: 'admin@gigflow.com', password: hashedPassword, role: 'admin' },
      { name: 'Sarah Johnson', email: 'sarah@gigflow.com', password: hashedPassword, role: 'sales' },
      { name: 'Mike Chen', email: 'mike@gigflow.com', password: hashedPassword, role: 'sales' },
    ]);

    console.log('👥 Created users');

    const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];
    const sources = ['Website', 'Instagram', 'Referral'];
    const assignees = [sales1._id, sales2._id];

    const leadsData = [
      { name: 'Rahul Sharma', email: 'rahul.sharma@techcorp.com', phone: '+91-9876543210', company: 'TechCorp India', status: 'Qualified', source: 'Instagram', notes: 'Interested in enterprise plan' },
      { name: 'Priya Patel', email: 'priya@startupx.io', phone: '+91-8765432109', company: 'StartupX', status: 'New', source: 'Website', notes: 'Signed up from blog post' },
      { name: 'David Miller', email: 'david.miller@gmail.com', phone: '+1-555-0123', company: 'Miller & Co', status: 'Contacted', source: 'Referral', notes: 'Referred by Rahul Sharma' },
      { name: 'Ananya Krishnan', email: 'ananya@designstudio.com', phone: '+91-7654321098', company: 'Design Studio', status: 'Lost', source: 'Instagram', notes: 'Went with competitor' },
      { name: 'James Wilson', email: 'james@enterprises.com', phone: '+1-555-0456', company: 'Wilson Enterprises', status: 'New', source: 'Website', notes: 'Downloaded whitepaper' },
      { name: 'Fatima Al-Hassan', email: 'fatima@techme.ae', phone: '+971-50-1234567', company: 'TechMe UAE', status: 'Qualified', source: 'Referral', notes: 'High-value potential' },
      { name: 'Carlos Rodriguez', email: 'carlos@bizlatam.mx', phone: '+52-55-1234-5678', company: 'BizLatam', status: 'Contacted', source: 'Website', notes: 'Needs demo scheduled' },
      { name: 'Sneha Reddy', email: 'sneha@softlab.in', phone: '+91-6543210987', company: 'SoftLab', status: 'New', source: 'Instagram', notes: 'Clicked sponsored post' },
      { name: 'Thomas Brown', email: 'thomas@innovate.co.uk', phone: '+44-20-1234-5678', company: 'Innovate UK', status: 'Qualified', source: 'Website', notes: 'Ready to sign contract' },
      { name: 'Meera Nair', email: 'meera@consultingco.com', phone: '+91-5432109876', company: 'Consulting Co', status: 'Lost', source: 'Referral', notes: 'Budget constraints' },
      { name: 'Aiden Park', email: 'aiden@korean-tech.kr', phone: '+82-10-1234-5678', company: 'Korean Tech', status: 'New', source: 'Website', notes: '' },
      { name: 'Lucía Fernández', email: 'lucia@mediaspain.es', phone: '+34-91-123-4567', company: 'Media Spain', status: 'Contacted', source: 'Instagram', notes: 'Follow up next week' },
      { name: 'Arjun Kapoor', email: 'arjun@fintech.in', phone: '+91-4321098765', company: 'FinTech India', status: 'Qualified', source: 'Referral', notes: 'Needs legal review' },
      { name: 'Emily Thompson', email: 'emily@ecommerce.com', phone: '+1-555-0789', company: 'E-Commerce Plus', status: 'New', source: 'Website', notes: 'Trial signup' },
      { name: 'Ravi Kumar', email: 'ravi@softwarehub.com', phone: '+91-3210987654', company: 'Software Hub', status: 'Contacted', source: 'Instagram', notes: 'Product demo done' },
    ];

    const leads = leadsData.map((lead, i) => ({
      ...lead,
      assignedTo: assignees[i % 2],
      createdBy: admin._id,
    }));

    await Lead.insertMany(leads);
    console.log(`🌱 Seeded ${leads.length} leads`);

    console.log('\n✅ Seed completed!\n');
    console.log('📋 Test Credentials:');
    console.log('  Admin:  admin@gigflow.com  / password123');
    console.log('  Sales:  sarah@gigflow.com  / password123');
    console.log('  Sales:  mike@gigflow.com   / password123\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
