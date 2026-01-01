import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, User, Mail, Lock, Shield, 
  CheckCircle, AlertCircle, Eye, EyeOff, Key, 
  Sparkles, Brain, Target, ShieldCheck, UserCircle,
  Fingerprint, BadgeCheck
} from 'lucide-react'

export default function Settings() {
    const { user, login } = useAuth()

    // Profile state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profileLoading, setProfileLoading] = useState(false)
    const [profileMsg, setProfileMsg] = useState('')
    const [profileErr, setProfileErr] = useState('')

    // Password state
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordMsg, setPasswordMsg] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name || '')
            setEmail(user.email || '')
        }
    }, [user])

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setProfileMsg('')
        setProfileErr('')

        if (!name.trim() || !email.trim()) {
            setProfileErr('Name and email are required')
            return
        }

        setProfileLoading(true)
        try {
            const response = await api.put('/auth/profile', { name, email })
            setProfileMsg(response.data.message || 'Profile updated successfully')

            // Update the user context with new data
            const updatedUser = response.data.user
            login(localStorage.getItem('token'), updatedUser)

            setTimeout(() => setProfileMsg(''), 3000)
        } catch (error) {
            setProfileErr(error.response?.data?.message || 'Failed to update profile')
            setTimeout(() => setProfileErr(''), 5000)
        } finally {
            setProfileLoading(false)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setPasswordMsg('')
        setPasswordErr('')

        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordErr('All password fields are required')
            return
        }

        if (newPassword.length < 6) {
            setPasswordErr('New password must be at least 6 characters')
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordErr('New passwords do not match')
            return
        }

        setPasswordLoading(true)
        try {
            const response = await api.put('/auth/password', {
                oldPassword,
                newPassword
            })
            setPasswordMsg(response.data.message || 'Password changed successfully')
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setTimeout(() => setPasswordMsg(''), 3000)
        } catch (error) {
            setPasswordErr(error.response?.data?.message || 'Failed to change password')
            setTimeout(() => setPasswordErr(''), 5000)
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                        <SettingsIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                            Account Settings
                        </h1>
                        <p className="text-amber-600/70 dark:text-amber-400/70">Manage your account settings and preferences</p>
                    </div>
                </div>
            </motion.div>

            {/* Account Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Account Information</h2>
                                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Your account details and permissions</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                            <div>
                                <label className="text-sm font-medium text-amber-600/70 dark:text-amber-400/70 flex items-center gap-1 mb-1">
                                    <Fingerprint className="w-3 h-3" />
                                    User ID
                                </label>
                                <p className="text-sm font-mono mt-1 text-amber-900 dark:text-amber-100 bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                                    {user?.id}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-amber-600/70 dark:text-amber-400/70 flex items-center gap-1 mb-1">
                                    <BadgeCheck className="w-3 h-3" />
                                    Role
                                </label>
                                <p className="text-sm mt-1 capitalize">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                                        {user?.role}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-amber-600/70 dark:text-amber-400/70 flex items-center gap-1 mb-1">
                                    <UserCircle className="w-3 h-3" />
                                    Account Status
                                </label>
                                <p className="text-sm mt-1 capitalize">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                                        Active
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Profile Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                                <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Profile Settings</h2>
                                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Update your personal information</p>
                            </div>
                        </div>

                        {profileMsg && (
                            <div className="px-4 py-3 rounded-xl border flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-800/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span>{profileMsg}</span>
                            </div>
                        )}

                        {profileErr && (
                            <div className="px-4 py-3 rounded-xl border flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                                </div>
                                <span>{profileErr}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                icon={<User className="w-4 h-4 text-amber-400" />}
                                className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                icon={<Mail className="w-4 h-4 text-amber-400" />}
                                className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-amber-200 dark:border-amber-800">
                            <Button
                                type="submit"
                                loading={profileLoading}
                                disabled={profileLoading}
                                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {profileLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Updating...
                                    </span>
                                ) : (
                                    'Update Profile'
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>

            {/* Password Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                                <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Change Password</h2>
                                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Secure your account with a new password</p>
                            </div>
                        </div>

                        {passwordMsg && (
                            <div className="px-4 py-3 rounded-xl border flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-800/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span>{passwordMsg}</span>
                            </div>
                        )}

                        {passwordErr && (
                            <div className="px-4 py-3 rounded-xl border flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                                </div>
                                <span>{passwordErr}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    label="Current Password"
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    icon={<Lock className="w-4 h-4 text-amber-400" />}
                                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-9 text-amber-400 hover:text-amber-600 dark:hover:text-amber-300"
                                >
                                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Input
                                    label="New Password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password (min 6 characters)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    icon={<Lock className="w-4 h-4 text-amber-400" />}
                                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-9 text-amber-400 hover:text-amber-600 dark:hover:text-amber-300"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Input
                                    label="Confirm New Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    icon={<Lock className="w-4 h-4 text-amber-400" />}
                                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-9 text-amber-400 hover:text-amber-600 dark:hover:text-amber-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-amber-200 dark:border-amber-800">
                            <Button
                                type="submit"
                                loading={passwordLoading}
                                disabled={passwordLoading}
                                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {passwordLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Changing...
                                    </span>
                                ) : (
                                    'Change Password'
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>

            {/* Security Tips */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-amber-200 dark:border-amber-800"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Keep your account secure by using a strong, unique password</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Last updated: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}