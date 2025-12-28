import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import PasswordInput from './PasswordInput.jsx';

export default function PasswordReset() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Parola actuală este obligatorie';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Parola nouă este obligatorie';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Parola nouă trebuie să aibă cel puțin 6 caractere';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmarea parolei este obligatorie';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu se potrivesc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      setSuccess(true);

      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Password reset error:', error);

      let errorMessage = 'A apărut o eroare la schimbarea parolei';

      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Parola actuală este incorectă';
          break;
        case 'auth/weak-password':
          errorMessage = 'Parola nouă este prea slabă';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Pentru securitate, te rugăm să te autentifici din nou';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Prea multe încercări. Încearcă din nou mai târziu';
          break;
        default:
          errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (success) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-success">
              <div className="card-body text-center">
                <div className="mb-3">
                  <svg className="text-success" width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-success mb-3">Parolă schimbată cu succes!</h4>
                <p className="text-muted">Vei fi redirectat către dashboard în câteva secunde...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← Înapoi la Dashboard
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Schimbă Parola</h4>
            </div>
            <div className="card-body">
              {errors.general && (
                <div className="alert alert-danger mb-3">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Parola Actuală</label>
                  <PasswordInput
                    className={errors.currentPassword ? 'is-invalid' : ''}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Introdu parola actuală"
                  />
                  {errors.currentPassword && (
                    <div className="invalid-feedback">{errors.currentPassword}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Parola Nouă</label>
                  <PasswordInput
                    className={errors.newPassword ? 'is-invalid' : ''}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Introdu parola nouă"
                  />
                  {errors.newPassword && (
                    <div className="invalid-feedback">{errors.newPassword}</div>
                  )}
                  <div className="form-text">Parola trebuie să aibă cel puțin 6 caractere</div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirmă Parola Nouă</label>
                  <PasswordInput
                    className={errors.confirmPassword ? 'is-invalid' : ''}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirmă parola nouă"
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Se schimbă parola...
                      </>
                    ) : (
                      'Schimbă Parola'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <h6 className="card-title">Securitate</h6>
              <ul className="list-unstyled small text-muted mb-0">
                <li>• Parola trebuie să aibă cel puțin 6 caractere</li>
                <li>• Folosește o combinație de litere, cifre și simboluri</li>
                <li>• Nu reutiliza parole vechi</li>
                <li>• Vei fi deconectat automat după schimbarea parolei</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
