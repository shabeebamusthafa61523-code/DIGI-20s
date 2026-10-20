import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/user.model.js';
import Designation from './src/models/designation.model.js';
import Department from './src/modules/departments/department.model.js';

dotenv.config();

async function run() {
  try {
    const mongoUri = process.env.DATABASE_URL || process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://shabeeba:9995982324@cluster0.i23tzbf.mongodb.net/digicrm20s?appName=Cluster0';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!');

    // 1. Seed Default Designations if none exist
    const desCount = await Designation.countDocuments();
    if (desCount === 0) {
      const defaultDesignations = [
        "Super Admin",
        "Admin",
        "Manager",
        "HR Manager",
        "Graphic Designer",
        "Digital Marketer",
        "React Developer",
        "Node Developer",
        "Flutter Developer",
        "Fullstack"
      ];
      await Designation.insertMany(defaultDesignations.map(name => ({ name, isActive: true })));
      console.log('🌱 Seeded default designations.');
    }

    // 2. Seed Default Departments if none exist
    const deptCount = await Department.countDocuments();
    if (deptCount === 0) {
      const defaultDepartments = [
        { name: "HR & Admin", code: "HR" },
        { name: "Marketing", code: "MKT" },
        { name: "Development", code: "DEV" },
        { name: "Designing", code: "DSN" }
      ];
      await Department.insertMany(defaultDepartments.map(d => ({
        name: d.name,
        code: d.code,
        status: true
      })));
      console.log('🌱 Seeded default departments.');
    }

    const hrDept = await Department.findOne({ code: 'HR' });
    const adminDesig = await Designation.findOne({ name: 'Admin' });
    const superAdminDesig = await Designation.findOne({ name: 'Super Admin' });

    // 3. Seed / Update Super Admin
    const superAdminEmail = 'superadmin@gmail.com';
    const superAdminPasswordPlain = 'SuperAdmin@123';
    const superAdminHash = await bcrypt.hash(superAdminPasswordPlain, 10);

    let superAdmin = await User.findOne({ email: superAdminEmail });
    if (!superAdmin) {
      superAdmin = new User({
        name: 'Super Admin',
        email: superAdminEmail,
        phone: '9999999999',
        role: 'superadmin',
        role_id: '0',
        isSuperAdmin: true,
        password: superAdminHash,
        passwordHash: superAdminHash,
        status: 'active',
        isActive: true,
        department: hrDept ? hrDept.name : 'HR & Admin',
        departmentId: hrDept ? hrDept._id : undefined,
        designation: superAdminDesig ? superAdminDesig.name : 'Super Admin',
        designationId: superAdminDesig ? superAdminDesig._id : undefined,
        permissions: []
      });
      await superAdmin.save();
      console.log('✨ Created NEW dedicated Super Admin account.');
    } else {
      superAdmin.name = 'Super Admin';
      superAdmin.isSuperAdmin = true;
      superAdmin.role = 'superadmin';
      superAdmin.role_id = '0';
      superAdmin.password = superAdminHash;
      superAdmin.passwordHash = superAdminHash;
      superAdmin.status = 'active';
      superAdmin.isActive = true;
      if (hrDept && !superAdmin.departmentId) superAdmin.departmentId = hrDept._id;
      if (superAdminDesig && !superAdmin.designationId) superAdmin.designationId = superAdminDesig._id;
      await superAdmin.save();
      console.log('✨ Updated existing Super Admin credentials.');
    }

    // 4. Seed / Update Admin
    const adminEmail = 'admin@gmail.com';
    const adminPasswordPlain = 'Admin@123';
    const adminHash = await bcrypt.hash(adminPasswordPlain, 10);

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: 'Admin',
        email: adminEmail,
        phone: '9876543210',
        role: 'admin',
        role_id: '2',
        isSuperAdmin: false,
        password: adminHash,
        passwordHash: adminHash,
        status: 'active',
        isActive: true,
        department: hrDept ? hrDept.name : 'HR & Admin',
        departmentId: hrDept ? hrDept._id : undefined,
        designation: adminDesig ? adminDesig.name : 'Admin',
        designationId: adminDesig ? adminDesig._id : undefined,
        permissions: []
      });
      await admin.save();
      console.log('✨ Created NEW dedicated Admin account.');
    } else {
      admin.name = 'Admin';
      admin.isSuperAdmin = false;
      admin.role = 'admin';
      admin.role_id = '2';
      admin.password = adminHash;
      admin.passwordHash = adminHash;
      admin.status = 'active';
      admin.isActive = true;
      if (hrDept && !admin.departmentId) admin.departmentId = hrDept._id;
      if (adminDesig && !admin.designationId) admin.designationId = adminDesig._id;
      await admin.save();
      console.log('✨ Updated existing Admin credentials.');
    }

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('------------------------------------------------------');
    console.log('👑 SUPER ADMIN CREDENTIALS:');
    console.log(`   Email:    ${superAdminEmail}`);
    console.log(`   Password: ${superAdminPasswordPlain}`);
    console.log(`   Role:     superadmin (role_id: 0)`);
    console.log('------------------------------------------------------');
    console.log('🛡️  ADMIN CREDENTIALS:');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPasswordPlain}`);
    console.log(`   Role:     admin (role_id: 2)`);
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding credentials:', err);
    process.exit(1);
  }
}

run();
