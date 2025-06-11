import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Tab,
  Tabs,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ViewResultIcon from '@mui/icons-material/RemoveRedEye';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: '10px'
}));

const SeverityColors = {
  'Tidak ada': '#4caf50',
  'Ringan': '#8bc34a',
  'Sedang': '#ff9800',
  'Parah': '#f44336',
  'Proliferatif': '#9c27b0'
};

const RetinaScanPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = Scan, 1 = Hasil
  const navigate = useNavigate();
  const { theme: customTheme } = useCustomTheme();
  
  // Debug: Log theme colors
  useEffect(() => {
    console.log('Theme colors:', {
      primary: customTheme.primary,
      secondary: customTheme.secondary,
      name: customTheme.name
    });
  }, [customTheme]);
  
  // Membuat tema Material-UI yang disesuaikan dengan tema aplikasi
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: customTheme.primary,
      },
      secondary: {
        main: customTheme.secondary,
      },
      success: {
        main: '#4caf50',
      },
      error: {
        main: '#f44336',
      }
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          h5: {
            color: customTheme.primary, // Judul "Unggah Citra Fundus" menggunakan warna tema
          },
          h6: {
            color: customTheme.primary, // Menambahkan styling untuk h6 "Pilih Gambar Retina"
          },
          body2: {
            color: 'rgba(0, 0, 0, 0.6)', // Warna teks deskripsi
          }
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
          outlinedPrimary: {
            borderColor: customTheme.primary,
            color: customTheme.primary,
            '&:hover': {
              borderColor: customTheme.primary,
              backgroundColor: `${customTheme.primary}10`,
            },
          },
          containedPrimary: {
            background: `linear-gradient(to right, ${customTheme.primary}, ${customTheme.secondary})`,
            '&:hover': {
              background: `linear-gradient(to right, ${customTheme.primary}, ${customTheme.secondary})`,
              opacity: 0.9,
            }
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: customTheme.primary,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: customTheme.primary,
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: customTheme.primary,
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: `${customTheme.primary}20`,
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            '&.MuiSvgIcon-fontSizeLarge': {
              color: customTheme.primary,
            }
          }
        }
      }
    },
  });
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Fetch user's analysis history
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_URL}/api/analysis/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAnalysisHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchHistory();
  }, [navigate, result, API_URL]);

  const handleDeleteAnalysis = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Konfirmasi penghapusan
      if (!window.confirm('Apakah Anda yakin ingin menghapus data analisis ini?')) {
        return;
      }

      await axios.delete(`${API_URL}/api/analysis/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh daftar setelah penghapusan
      const response = await axios.get(`${API_URL}/api/analysis/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysisHistory(response.data);
    } catch (error) {
      console.error('Error deleting analysis:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        setError('Hanya file JPEG dan PNG yang diterima.');
        setSelectedFile(null);
        setPreview('');
        return;
      }

      // Validasi ukuran file (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB.');
        setSelectedFile(null);
        setPreview('');
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
      setResult(null);
      setActiveTab(0); // Kembali ke tab Scan
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Silakan pilih file terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(`${API_URL}/api/analysis/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      // Sekarang response langsung berisi imageData (base64)
      setResult(response.data.prediction);
      
      // Refresh history after successful upload
      const historyResponse = await axios.get(`${API_URL}/api/analysis/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysisHistory(historyResponse.data);
      
      // Otomatis beralih ke tab hasil setelah upload berhasil
      setActiveTab(1);
    } catch (error) {
      console.error('Error uploading:', error);
      if (error.response) {
        setError(error.response.data.message || 'Terjadi kesalahan saat mengupload file.');
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview('');
    setResult(null);
    setError('');
    setActiveTab(0); // Kembali ke tab Scan
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewResult = () => {
    setActiveTab(1); // Pindah ke tab Hasil
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={showHistory ? 6 : 12}>
            <StyledPaper>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                  Unggah Citra Fundus
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<HistoryIcon />}
                  onClick={toggleHistory}
                  sx={{ borderColor: customTheme.primary, color: customTheme.primary }}
                >
                  {showHistory ? 'Sembunyikan Riwayat' : 'Tampilkan Riwayat'}
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {/* Tab Navigation */}
              {result && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Scan" />
                    <Tab label="Hasil Analisis" />
                  </Tabs>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Tab Content */}
              {activeTab === 0 && (
                <>
                  {!selectedFile ? (
                    <Box 
                      display="flex" 
                      flexDirection="column" 
                      alignItems="center" 
                      justifyContent="center"
                      sx={{ 
                        border: '2px dashed #ccc', 
                        borderRadius: 2, 
                        p: 5,
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <CloudUploadIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: `${customTheme.primary} !important`, 
                          mb: 2 
                        }} 
                      />
                      <Typography variant="h6" gutterBottom>
                        Pilih Gambar Retina
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center" mb={3}>
                        Format yang didukung: JPG, JPEG, PNG.<br />
                        Ukuran maksimal: 5MB
                      </Typography>
                      <Button 
                        component="label" 
                        variant="contained" 
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          background: `linear-gradient(to right, ${customTheme.primary}, ${customTheme.secondary}) !important`,
                          '&:hover': {
                            background: `linear-gradient(to right, ${customTheme.primary}, ${customTheme.secondary}) !important`,
                            opacity: 0.9,
                          }
                        }}
                      >
                        Pilih File
                        <VisuallyHiddenInput 
                          type="file" 
                          accept="image/jpeg, image/png" 
                          onChange={handleFileChange} 
                        />
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Box 
                        display="flex" 
                        justifyContent="center" 
                        mb={3}
                      >
                        <Box
                          component="img"
                          src={preview}
                          alt="Preview"
                          sx={{ 
                            maxWidth: '100%', 
                            maxHeight: '300px', 
                            borderRadius: 2,
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" gutterBottom>
                        File: {selectedFile.name}
                      </Typography>
                      <Box display="flex" justifyContent="center" gap={2} mt={2}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={handleUpload}
                          disabled={isLoading}
                          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                          sx={{
                            background: isLoading ? 'grey' : `linear-gradient(to right, ${customTheme.primary}, ${customTheme.secondary})`,
                            '&:hover': {
                              background: `linear-gradient(to right, ${customTheme.primary}, ${customTheme.secondary})`,
                              opacity: 0.9,
                            }
                          }}
                        >
                          {isLoading ? 'Menganalisis...' : 'Analisis'}
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          onClick={handleReset}
                          startIcon={<DeleteIcon />}
                        >
                          Reset
                        </Button>
                        {result && (
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={handleViewResult}
                            startIcon={<ViewResultIcon />}
                            sx={{
                              borderColor: '#4caf50',
                              color: '#4caf50',
                              '&:hover': {
                                borderColor: '#4caf50',
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              }
                            }}
                          >
                            Lihat Hasil
                          </Button>
                        )}
                      </Box>
                    </Box>
                  )}
                </>
              )}

              {activeTab === 1 && result && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>
                    Hasil Analisis
                  </Typography>
                  <Card 
                    sx={{ 
                      borderLeft: `5px solid ${SeverityColors[result.severity] || customTheme.primary}`,
                      mb: 2 
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="overline" color="text.secondary">
                            Tingkat Keparahan
                          </Typography>
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {result.severity}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="overline" color="text.secondary">
                            Tingkat Kepercayaan
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {(result.confidence * 100).toFixed(1)}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Gambar retina Anda telah dianalisis menggunakan model AI. Hasil ini menunjukkan 
                    tingkat keparahan retinopati diabetik berdasarkan citra retina yang diberikan.
                    Untuk interpretasi medis yang tepat, silakan konsultasikan dengan dokter.
                  </Typography>
                </Box>
              )}
            </StyledPaper>
          </Grid>

          {showHistory && (
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography variant="h6" fontWeight="medium" mb={2}>
                  <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Riwayat Analisis
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {analysisHistory.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <ImageIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Belum ada riwayat analisis
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {analysisHistory.map((item, index) => (
                      <React.Fragment key={item._id}>
                        <ListItem
                          alignItems="flex-start"
                          secondaryAction={
                            <Box display="flex" alignItems="center">
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                mr={1}
                              >
                                {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                              </Typography>
                              <IconButton 
                                edge="end" 
                                aria-label="delete"
                                onClick={() => handleDeleteAnalysis(item._id)}
                                size="small"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          }
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: SeverityColors[item.severity] || customTheme.primary,
                              mr: 2
                            }}
                          >
                            {item.severityLevel}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight="medium">
                                {item.severity} ({(item.confidence * 100).toFixed(1)}%)
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                {item.originalFilename}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < analysisHistory.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </StyledPaper>
            </Grid>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default RetinaScanPage; 