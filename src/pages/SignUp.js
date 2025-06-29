import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { SitemarkIcon } from '../components/CustomIcons';
import { AuthAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import AppAppBar from '../components/AppAppBar';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
    padding: theme.spacing(4),
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  React.useEffect(() => {
    AuthAPI.getMe()
      .then(() => {
        navigate('/');
      })
      .catch(() => {});
  }, [navigate]);

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [lastNameError, setLastNameError] = React.useState(false);
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
  const [kvkkChecked, setKvkkChecked] = React.useState(false);
  const [kvkkError, setKvkkError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleKvkkChange = (event) => {
    setKvkkChecked(event.target.checked);
    if (event.target.checked) {
      setKvkkError(false);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const name = document.getElementById('name');
    const lastName = document.getElementById('lastName');

    let isValid = true;

    // Email Validasyonu
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Lütfen geçerli bir e-posta adresi giriniz.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Şifre Validasyonu
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Şifre en az 6 karakter uzunluğunda olmalıdır.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    // İsim Validasyonu
    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('İsim girilmesi zorunludur.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    // Soyisim Validasyonu
    if (!lastName.value || lastName.value.length < 1) {
      setLastNameError(true);
      setLastNameErrorMessage('Soyisim girilmesi zorunludur.');
      isValid = false;
    } else {
      setLastNameError(false);
      setLastNameErrorMessage('');
    }

    // KVKK Checkbox Validasyonu
    if (!kvkkChecked) {
      setKvkkError(true);
      showError('Kişisel verilerinizin işlenmesini kabul etmelisiniz.');
      isValid = false;
    } else {
      setKvkkError(false);
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return; // Eğer validasyon başarısız olursa submit etme
    }

    setIsLoading(true);

    const data = new FormData(event.currentTarget);
    const userData = {
      name: data.get('name'),
      surname: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      const response = await AuthAPI.signUp(userData);
      if (response.data && response.data.success) {
        showSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
        setTimeout(() => {
          navigate('/sign-in');
        }, 2000);
      } else {
        showError('Kayıt başarısız: Beklenmeyen yanıt formatı');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Kayıt işlemi sırasında bir hata oluştu';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(1.75rem, 9vw, 2.15rem)' }}
          >
            Kayıt Ol
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Ad</FormLabel>
              <TextField
                autoComplete="given-name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Adınız"
                error={nameError}
                helperText={nameErrorMessage}
                disabled={isLoading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="lastName">Soyad</FormLabel>
              <TextField
                autoComplete="family-name"
                name="lastName"
                required
                fullWidth
                id="lastName"
                placeholder="Soyadınız"
                error={lastNameError}
                helperText={lastNameErrorMessage}
                disabled={isLoading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">E-posta</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="sizin@epostadresiniz.com"
                name="email"
                autoComplete="email"
                error={emailError}
                helperText={emailErrorMessage}
                disabled={isLoading}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Şifre</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                error={passwordError}
                helperText={passwordErrorMessage}
                disabled={isLoading}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox 
                  value="kvkkApproval"
                  color="primary" 
                  checked={kvkkChecked}
                  onChange={handleKvkkChange}
                />
              }
              label={
                <Typography variant="body2" color={kvkkError ? 'error' : 'text.secondary'}>
                  Kişisel verilerinizin anonim olarak analiz amaçlı kullanılmasını kabul ediyorsunuz.
                </Typography>
              }
              disabled={isLoading}
            />
            {kvkkError && (
              <Typography variant="caption" color="error" sx={{ mt: -1, ml: 4 }}>
                KVKK onayını vermeniz gerekmektedir.
              </Typography>
            )}
            <Button 
              type="submit" 
              fullWidth 
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Button>
          </Box>
        </Card>

        <Toast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          onClose={hideToast}
        />
      </SignUpContainer>
    </AppTheme>
  );
}