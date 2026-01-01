// Import bcrypt library for password hashing and comparison
import bcrypt from 'bcryptjs';

// Import Joi validation schemas for registration and login
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

// Import User and Role models for database operations
import { Role, User } from '../models/index.js';

// Import JWT token signing function from auth middleware
import { signToken } from '../middlewares/auth.js';

// Import async handler wrapper for error handling
import { asyncHandler } from '../utils/asyncHandler.js';

// Controller function for user registration
// Public endpoint for creating new student or admin accounts
export const register = asyncHandler(async (req, res) => {
  // Validate request body against registration schema using Joi
  const { value, error } = registerSchema.validate(req.body);

  // Return 400 Bad Request if validation fails
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Destructure validated user data
  const { name, email, password, role } = value;

  // Log registration attempt for debugging
  console.log('Registration attempt:', { name, email, role });

  // Check if email already exists in database
  const existing = await User.findOne({ email });

  // Return 409 Conflict if email is already registered
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  // Validate role against allowed roles
  // Normal registration for student and admin only
  // Teacher and Parent registration has been removed from the system
  // MongoDB stores role as string, validated against User model enum
  const validRoles = ['student', 'admin'];

  // Return 400 if role is not in allowed list
  if (!validRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });

  // Hash password using bcrypt with salt rounds of 10
  // This securely encrypts the password before storing in database
  const hashed = await bcrypt.hash(password, 10);

  // Create new user document in database
  const user = await User.create({ name, email, password: hashed, role });

  // Log successful user creation for debugging
  console.log('User created:', user.toJSON());

  // Generate JWT token with user data for authentication
  // Token includes user ID, email, role, and premium status
  const token = signToken({
    id: user._id,
    email: user.email,
    role: user.role,
    isPremium: user.isPremium
  });

  // Return 201 Created with token and user data (excluding password)
  return res.status(201).json({
    token,
    user: {
      id: user._id,
      name,
      email,
      role,
      isPremium: user.isPremium
    }
  });
});

// Controller function for user login
// Public endpoint for authenticating existing users
export const login = asyncHandler(async (req, res) => {
  // Validate request body against login schema using Joi
  const { value, error } = loginSchema.validate(req.body);

  // Return 400 Bad Request if validation fails
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Destructure validated credentials
  const { email, password } = value;

  // Find user by email in database
  const user = await User.findOne({ email });

  // Return 401 Unauthorized if user not found
  // Use generic "Invalid credentials" message for security (don't reveal if email exists)
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  // Compare provided password with hashed password in database
  const valid = await bcrypt.compare(password, user.password);

  // Return 401 Unauthorized if password doesn't match
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  // Generate JWT token with user data for authentication
  const token = signToken({
    id: user._id,
    email: user.email,
    role: user.role,
    isPremium: user.isPremium
  });

  // Return token and user data (excluding password)
  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium
    }
  });
});

// Controller function to get current user profile
// Protected endpoint - user must be authenticated
export const me = asyncHandler(async (req, res) => {
  // Find user by ID from JWT token (set by authenticate middleware)
  // Exclude password field from query result using select('-password')
  const user = await User.findById(req.user.id).select('-password');

  // Return 404 if user not found (edge case - token valid but user deleted)
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Return user data
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isPremium: user.isPremium
  });
});

// Controller function to get available signup roles
// Public endpoint for populating registration form role dropdown
export const getSignupRoles = asyncHandler(async (req, res) => {
  try {
    // Return static list of allowed roles
    // Moving away from dynamic Role table to simplify system
    // Only student and admin roles are available for registration
    // Teacher and parent roles have been removed
    res.json(['student', 'admin']);
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching roles:', error);

    // Return default roles even if error occurs
    res.json(['student', 'admin']);
  }
});

// Controller function to update user profile
// Protected endpoint for changing name and email
export const updateProfile = asyncHandler(async (req, res) => {
  // Destructure updated profile data from request body
  const { name, email } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  // Check if new email is already taken by another user
  // Use $ne (not equal) to exclude current user from check
  const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });

  // Return 409 Conflict if email is already in use by another account
  if (existingUser) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  // Find current user by ID from JWT token
  const user = await User.findById(req.user.id);

  // Return 404 if user not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update user fields
  user.name = name;
  user.email = email;

  // Save updated user to database
  await user.save();

  // Return success response with updated user data
  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Controller function to change user password
// Protected endpoint for updating password with verification
export const changePassword = asyncHandler(async (req, res) => {
  // Destructure password data from request body
  const { oldPassword, newPassword } = req.body;

  // Validate required fields
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old password and new password are required' });
  }

  // Validate new password length
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  // Find current user by ID from JWT token
  const user = await User.findById(req.user.id);

  // Return 404 if user not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify old password matches current password in database
  const isValidPassword = await bcrypt.compare(oldPassword, user.password);

  // Return 401 Unauthorized if old password is incorrect
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  // Hash new password with bcrypt (salt rounds = 10)
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password
  user.password = hashedPassword;

  // Save updated user to database
  await user.save();

  // Return success message
  res.json({ message: 'Password changed successfully' });
});

// Controller function for checkout/premium subscription
// Public endpoint for creating user account with premium status based on selected plan
// This handles payment checkout flow from the Pricing page
export const checkout = asyncHandler(async (req, res) => {
  // Destructure checkout data from request body
  const { name, email, password, plan, billingCycle } = req.body;

  // Validate required fields
  if (!name || !email || !password || !plan) {
    return res.status(400).json({ message: 'Name, email, password, and plan are required' });
  }

  // Check if email already exists in database
  const existing = await User.findOne({ email });

  // Return 409 Conflict if email is already registered
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  // Validate selected plan against allowed plans
  const validPlans = ['basic', 'pro', 'enterprise'];

  // Return 400 if plan is invalid
  if (!validPlans.includes(plan.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid plan selected' });
  }

  // Determine if user should have premium access based on plan
  // Basic plan is free (no premium), Pro and Enterprise have premium access
  const isPremium = plan.toLowerCase() === 'pro' || plan.toLowerCase() === 'enterprise';

  // Hash password using bcrypt with salt rounds of 10
  const hashed = await bcrypt.hash(password, 10);

  // Create user account with student role and premium status
  // All checkout users are registered as students
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: 'student',          // Checkout always creates student accounts
    isPremium: isPremium,     // Premium access based on selected plan

  });

  // Log checkout completion for debugging and analytics
  console.log('Checkout completed - User created:', {
    id: user._id,
    email: user.email,
    plan: plan,
    isPremium: isPremium
  });

  // Generate JWT token for auto-login after successful checkout
  // User is automatically logged in upon account creation
  const token = signToken({
    id: user._id,
    email: user.email,
    role: user.role,
    isPremium: user.isPremium
  });

  // Return 201 Created with success message, token, and user data
  return res.status(201).json({
    message: 'Account created successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium
    }
  });
});
