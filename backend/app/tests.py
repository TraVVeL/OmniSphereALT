from io import BytesIO
from rest_framework.exceptions import AuthenticationFailed
from .models import ConfirmationCode
from django.contrib.auth import get_user_model
from unittest.mock import patch
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

User = get_user_model()


class UserRegistrationTestCase(APITestCase):
    """TESTING USER'S REGISTRATION"""

    def setUp(self):
        self.url = reverse('register')

    def test_user_registration_success(self):
        """Successful test registration"""
        data = {
            "email": "test@test.test",
            "password": "12345678"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("email", response.data)
        self.assertIn("username", response.data)
        self.assertTrue(User.objects.filter(email="test@test.test").exists())

    def test_registration_without_password(self):
        """Attempt to register without password"""
        self.invalid_data = True
        data = {
            "email": "test@test.test"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_registration_with_invalid_email(self):
        """Attempt to register with invalid email"""
        self.invalid_data = True

        data = {
            "email": "not-an-email",
            "password": "12345678"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_registration_with_short_password(self):
        """Attempt to register with short password"""
        self.invalid_data = True

        data = {
            "email": "test@test.test",
            "password": "123"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_registration_with_existing_email(self):
        """Attempt to register with existing email"""
        self.invalid_data = True

        User.objects.create_user(email="test@test.test", password="password123", username="test@test.test")

        data = {
            "email": "test@test.test",
            "password": "newpassword123"
        }

        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"][0], "Email is already in use.")

    def test_registration_with_empty_email(self):
        """Attempt to register with empty email"""
        self.invalid_data = True

        data = {
            "password": "12345678"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_registration_with_weak_password(self):
        """Attempt to register with weak password"""
        self.invalid_data = True

        data = {
            "email": "test@test.test",
            "password": "123"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)


class UserLoginTestCase(APITestCase):
    """TESTING USER'S AUTHENTICATION"""

    def setUp(self):
        """Creating user for tests"""
        self.user = User.objects.create_user(
            email="test@test.test", password="12345678", username="testuser"
        )
        self.url = reverse('login')

    def test_successful_login(self):
        """Successful log in"""
        data = {
            "email": "test@test.test",
            "password": "12345678"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["username"], self.user.username)

    def test_login_with_invalid_email(self):
        """Attempt to log in with invalid email"""
        self.invalid_data = True

        data = {
            "email": "invalid@example.com",
            "password": "12345678"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.data["error"][0], "Invalid email or password.")

    def test_login_with_invalid_password(self):
        """Attempt to login with invalid password"""
        self.invalid_data = True

        data = {
            "email": "test@test.test",
            "password": "wrongpassword"
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.data["error"][0], "Invalid email or password.")

    def test_login_with_missing_email(self):
        """Attempt to login with missed email"""
        self.invalid_data = True

        data = {
            "password": "12345678"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertIn("This field is required.", response.data["email"])

    def test_login_with_missing_password(self):
        """Attempt to login with missed password"""
        self.invalid_data = True

        data = {
            "email": "test@test.test"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertIn("This field is required.", response.data["password"])


class CheckEmailTestCase(APITestCase):
    """TESTING EMAIL CHECKING"""

    def setUp(self):
        """Creating user for testing"""
        self.user = User.objects.create_user(
            email="test@test.test", password="12345678", username="testuser"
        )
        self.url = reverse('check_email')

    def test_check_existing_email(self):
        """Successful to check existed email"""
        data = {
            "email": "test@test.test"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["exists"], True)

    def test_check_non_existing_email(self):
        """Attempt to check not existed email"""
        self.invalid_data = True

        data = {
            "email": "nonexistent@test.test"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["exists"], False)

    def test_check_invalid_email(self):
        """Attempt to check invalid email"""
        self.invalid_data = True

        data = {
            "email": "not-an-email"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"][0], "Enter a valid email address.")


class CheckLoginTestCase(APITestCase):
    """TESTING LOGIN CHECKING"""

    def setUp(self):
        """Creating user for testing"""

        self.user = User.objects.create_user(
            email="test@test.test", password="12345678", username="testuser"
        )
        self.url = reverse(
            'check_username')

    def test_check_existing_username(self):
        """Successful to check existed username"""
        data = {
            "username": "testuser"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["exists"], True)

    def test_check_non_existing_username(self):
        """Attempt to check not existed username"""
        self.invalid_data = True

        data = {
            "username": "nonexistentuser"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["exists"], False)


class GetCodeTestCase(APITestCase):
    """TESTING GET CODE FOR EMAIL VERIFICATION"""

    def setUp(self):
        """Creating user for tests"""
        self.user = User.objects.create_user(
            email="test@test.test", password="12345678", username="testuser"
        )
        self.url = reverse('get_code')

    def test_get_code_for_existing_user(self):
        """Test to send code for existing user"""
        data = {
            "email": "test@test.test"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("confirmation_code", response.data)
        self.assertEqual(response.data["message"], "Confirmation code sent to your email")

    def test_get_code_for_non_existing_user(self):
        """Attempt to send a code for non existing user"""
        self.invalid_data = True

        data = {
            "email": "nonexistent@example.com"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "User with this email does not exist")

    def test_get_code_with_invalid_email(self):
        """Attempt to send a code for invalid email"""
        self.invalid_data = True

        data = {
            "email": "invalid-email"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"][0], "Enter a valid email address.")


class ResetPasswordConfirmTestCase(APITestCase):
    """TESTING RESET PASSWORD CONFIRMATION"""

    def setUp(self):
        """Creating user and code"""
        self.user = User.objects.create_user(
            email="test@test.test", password="12345678", username="testuser"
        )
        self.confirmation_code = ConfirmationCode.objects.create(
            user=self.user,
            confirmation_code="123456",
            expired=False
        )
        self.url = reverse('confirm_reset_password')

    def test_reset_password_success(self):
        """Successful reset password test"""
        data = {
            "email": "test@test.test",
            "code": "123456",
            "password": "newpassword123"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["username"], self.user.username)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("newpassword123"))

    def test_reset_password_user_not_found(self):
        """Attempting to reset password with non existing user"""
        self.invalid_data = True

        data = {
            "email": "nonexistent@test.test",
            "code": "123456",
            "password": "newpassword123"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"][0], "User with this email does not exist.")

    def test_reset_password_invalid_code(self):
        """Successful reset password with invalid code"""
        data = {
            "email": "test@test.test",
            "code": "invalidcode",
            "password": "newpassword123"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"][0], "Verification code does not match.")

    def test_reset_password_code_expired(self):
        """Attempt to use expired code"""
        self.invalid_data = True

        self.confirmation_code.expired = True
        self.confirmation_code.save()

        data = {
            "email": "test@test.test",
            "code": "123456",
            "password": "newpassword123"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"][0], "The confirmation code has expired.")

    def test_reset_password_same_as_old_password(self):
        """Attempt to use same password as old password"""
        self.invalid_data = True

        data = {
            "email": "test@test.test",
            "code": "123456",
            "password": "12345678"
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"][0], "New password cannot be the same as the old password.")


class TelegramAuthViewTestCase(APITestCase):
    """
    THIS TEST MAY BE INVALID SO
    FIXME: REFACTOR THIS PART OF CODE
    Testing telegram OAuth
    """

    def setUp(self):
        self.url = reverse('telegram_auth')

    @patch('app.services.TelegramAuthService.TelegramAuthService.verify_telegram_data')
    @patch('app.services.TelegramAuthService.BaseAuthService.download_profile_picture')
    def test_telegram_oauth_success(self, mock_download_profile_picture, mock_verify_telegram_data):
        """Successful case to authenticate user trough telegram"""
        mock_download_profile_picture.return_value = BytesIO(b"fake_image_data")

        mock_verify_telegram_data.return_value = {
            'id': 'telegram_id_123',
            'username': 'username',
            'first_name': 'First',
            'photo_url': 'http://example.com/profile.jpg'
        }

        data = {'auth_data': {'id': 'telegram_id_123', 'username': 'username', 'first_name': 'First',
                              'photo_url': 'http://example.com/profile.jpg'}}
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['username'], 'username')

    @patch('app.services.TelegramAuthService.TelegramAuthService.verify_telegram_data')
    def test_telegram_oauth_invalid_data(self, mock_verify_telegram_data):
        """Attempt to authenticate user trough telegram with invalid data"""
        self.invalid_data = True

        mock_verify_telegram_data.side_effect = AuthenticationFailed("No auth data provided")

        data = {'auth_data': None}
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "No auth data provided")
