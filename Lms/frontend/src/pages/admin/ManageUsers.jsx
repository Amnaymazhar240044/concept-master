import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { Users, UserPlus, Search, Filter, Mail, Shield, Trash2, Edit3, AlertCircle, CheckCircle, Crown, Sparkles, Target, Award, Brain, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ManageUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const u = await api.get('/admin/users')
      setUsers(u.data.data || [])
      const r = await api.get('/admin/roles')
      setRoles(r.data || [])
    } catch { }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    setMsg('')
    setLoading(true)
    try {
      await api.post('/admin/users', { name, email, password, role })
      setName(''); setEmail(''); setPassword(''); setRole('student')
      setMsg('User created successfully!')
      load()
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const setUserRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role })
      load()
    } catch { }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      load()
    } catch { }
  }

  const setPremium = async (id) => {
    try {
      const response = await api.patch(`/admin/users/${id}/premium`)

      // If admin toggled premium for themselves, update token and reload page
      if (currentUser && currentUser.id === id) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
        window.location.reload()
      } else {
        // Just reload the user list
        load()
      }
    } catch (error) {
      console.error('Failed to toggle premium:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'admin': return 'from-amber-600 to-orange-600'
      case 'teacher': return 'from-amber-500 to-orange-500'
      case 'student': return 'from-amber-400 to-orange-400'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRoleIcon = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'admin': return <Shield className="w-4 h-4" />
      case 'teacher': return <Edit3 className="w-4 h-4" />
      case 'student': return <Users className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Manage Users
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">Create and manage user accounts</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${msg.includes('success')
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-800/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
            } shadow-sm`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${msg.includes('success')
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : 'bg-red-100 dark:bg-red-900/30'
            }`}>
            {msg.includes('success') ? (
              <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
            )}
          </div>
          <span>{msg}</span>
        </motion.div>
      )}

      {/* Create User Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Create New User</h2>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Add a new user to the platform</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Input
                  placeholder="Full name"
                  label="Name *"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  label="Email *"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  label="Password *"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <Select
                  label="Role *"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.role_name}>{r.role_name}</option>
                  ))}
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={create}
                  disabled={!name.trim() || !email.trim() || !password || loading}
                  loading={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating User...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Create User
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
              <Sparkles className="w-4 h-4" />
              <span>Create accounts for students, teachers, or other admins</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="space-y-6">
            {/* List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Users</h2>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                    {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:outline-none transition-colors text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:outline-none transition-colors text-amber-900 dark:text-amber-100"
                >
                  <option value="all">All Roles</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.role_name}>{r.role_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Users Grid */}
            {loading ? (
              <div className="grid gap-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl animate-pulse border border-amber-200 dark:border-amber-800"></div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
                  {searchTerm || filterRole !== 'all' ? 'No users found' : 'No users available'}
                </h3>
                <p className="text-amber-600/70 dark:text-amber-400/70">
                  {searchTerm || filterRole !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by creating your first user'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user._id || user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* User Avatar */}
                        <div className={`w-12 h-12 rounded-full ${getRoleColor(user.role)} flex items-center justify-center text-white font-semibold shadow-md`}>
                          {getRoleIcon(user.role)}
                        </div>

                        {/* User Info */}
                        <div>
                          <div className="font-semibold text-amber-900 dark:text-amber-50">{user.name}</div>
                          <div className="flex items-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                            {user.isPremium && (
                              <span className="flex items-center gap-1 text-amber-500">
                                <Crown className="w-3 h-3" />
                                <span className="text-xs font-medium">Premium</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <Select
                          value={user.role}
                          onChange={e => setUserRole(user._id || user.id, e.target.value)}
                          className="min-w-[120px] border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                        >
                          {roles.map(r => (
                            <option key={r.id} value={r.role_name}>{r.role_name}</option>
                          ))}
                        </Select>

                        {user.role === 'student' && (
                          <button
                            onClick={() => setPremium(user._id || user.id)}
                            className={`p-2 rounded-lg transition-all duration-300 ${user.isPremium
                              ? 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:shadow-sm'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 hover:shadow-sm'
                              }`}
                            title={user.isPremium ? "Remove Premium" : "Grant Premium"}
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                        )}

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => remove(user._id || user.id)}
                          className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-sm hover:shadow-md"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Summary */}
            {filteredUsers.length > 0 && (
              <div className="pt-4 border-t border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between text-sm text-amber-600/70 dark:text-amber-400/70">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600"></div>
                      <span>Admin</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
                      <span>Teacher</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"></div>
                      <span>Student</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Total: {filteredUsers.length} users</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div >
  )
}