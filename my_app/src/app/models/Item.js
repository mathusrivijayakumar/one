import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], required: true },
});

// Prevent model overwrite
export const User = mongoose.models.User || mongoose.model("User", userSchema);

 

// Apartment Schema
const apartmentSchema = new mongoose.Schema({
  apartmentId: { type: Number, unique: true },
  name: { type: String, required: true },
});

apartmentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastApartment = await mongoose.models.Apartment.findOne().sort({ apartmentId: -1 });
    this.apartmentId = lastApartment ? lastApartment.apartmentId + 1 : 1001;
  }
  next();
});

// Prevent model overwrite
export const Apartment = mongoose.models.Apartment || mongoose.model("Apartment", apartmentSchema);

// Visitor Schema
const visitorSchema = new mongoose.Schema({
  apartmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment", required: true },
  visitorName: String,
  phoneNumber: String,
  entryDate: Date,
  exitDate: Date,
  uniqueCode: { type: Number, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

visitorSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastVisitor = await mongoose.models.Visitor.findOne().sort({ uniqueCode: -1 });
    this.uniqueCode = lastVisitor ? lastVisitor.uniqueCode + 1 : 1001;
  }
  next();
});

// Prevent model overwrite
export const Visitor = mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);
