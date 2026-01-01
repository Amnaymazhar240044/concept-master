import { useState, useEffect } from 'react'
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, IconButton
} from '@mui/material'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import api from '../../lib/api'

export default function TeacherRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rejectDialog, setRejectDialog] = useState({ open: false, id: null, reason: '' })
  const [success, setSuccess] = useState('')

  const fetchRequests = async () => {
    try {
      console.log('Fetching teacher requests...')
      const response = await api.get('/teacher-requests')
      console.log('Full response:', response)
      console.log('Response data:', response.data)

      // Handle both response structures: { data: [...] } or { total, page, limit, data: [...] }
      const requestsData = response.data.data || response.data
      console.log('Parsed requests:', requestsData)

      if (Array.isArray(requestsData)) {
        setRequests(requestsData)
        setError('')
      } else {
        console.error('Unexpected data structure:', requestsData)
        setError('Unexpected data structure received from server')
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err)
      console.error('Error details:', err.response?.data)
      setError(err.response?.data?.message || 'Failed to fetch teacher requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleApprove = async (id) => {
    try {
      console.log('Approving teacher request:', id)
      await api.patch(`/teacher-requests/${id}/approve`)
      console.log('Teacher request approved successfully')
      setSuccess('Teacher request approved successfully!')
      fetchRequests()
    } catch (err) {
      console.error('Failed to approve request:', err)
      setError('Failed to approve request')
    }
  }

  const handleReject = async () => {
    try {
      console.log('Rejecting teacher request:', rejectDialog.id)
      await api.patch(`/teacher-requests/${rejectDialog.id}/reject`, {
        rejection_reason: rejectDialog.reason
      })
      console.log('Teacher request rejected successfully')
      setSuccess('Teacher request rejected successfully!')
      setRejectDialog({ open: false, id: null, reason: '' })
      fetchRequests()
    } catch (err) {
      console.error('Failed to reject request:', err)
      setError('Failed to reject request')
    }
  }

  const getStatusChip = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error'
    }
    return <Chip label={status.charAt(0).toUpperCase() + status.slice(1)} color={colors[status]} size="small" />
  }

  if (loading) return <Typography>Loading...</Typography>

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>Teacher Registration Requests</Typography>
        <IconButton onClick={fetchRequests}>
          <RotateCcw />
        </IconButton>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>{getStatusChip(request.status)}</TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleApprove(request.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<XCircle />}
                            onClick={() => setRejectDialog({ open: true, id: request.id, reason: '' })}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      {request.status === 'rejected' && request.rejection_reason && (
                        <Typography variant="body2" color="text.secondary">
                          {request.rejection_reason}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {requests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No teacher requests found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, id: null, reason: '' })}>
        <DialogTitle>Reject Teacher Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
            placeholder="Please provide a reason for rejection..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, id: null, reason: '' })}>
            Cancel
          </Button>
          <Button onClick={handleReject} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
