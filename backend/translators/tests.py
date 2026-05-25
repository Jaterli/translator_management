from django.test import TestCase
from django.core.exceptions import ValidationError
from translators.models import Translator, ProfessionalProfile, LanguageCombination, Files

class TranslatorModeTest(TestCase):
    def setUp(self):
        self.translator = Translator.objects.create_user(
            email="testuser@example.com",
            password="securepassword",
            first_name="Test",
            last_name="User",
            address="123 Test Street",
            postal_code=12345,
            province="Madrid",
            country="Spain",
            gender="Masculino",
            mobile_phone="+34678901234",
        )

    def test_translator_creation(self):
        self.assertEqual(self.translator.email, "testuser@example.com")
        self.assertTrue(self.translator.check_password("securepassword"))

    def test_str_method(self):
        self.assertEqual(str(self.translator), "testuser@example.com")

class ProfessionalProfileTest(TestCase):
    def setUp(self):
        self.translator = Translator.objects.create_user(
            email="testprofile@example.com",
            password="securepassword",
            first_name="Profile",
            last_name="User"
        )
        self.profile = ProfessionalProfile.objects.create(
            translator=self.translator,
            native_languages="Spanish, English",
            education="Grado",
            degree="Filología Inglesa",
            employment_status="Empleado",
            experience="3-5 años",
            softwares="Trados, MemoQ"
        )

    def test_profile_creation(self):
        self.assertEqual(self.profile.translator, self.translator)
        self.assertEqual(self.profile.native_languages, "Spanish, English")

    def test_str_method(self):
        self.assertEqual(str(self.profile), f"Profile of {self.translator.email}")

class LanguageCombinationModelTest(TestCase):
    def setUp(self):
        self.translator = Translator.objects.create_user(
            email="testcombo@example.com",
            password="securepassword",
            first_name="Combo",
            last_name="User"
        )
        self.combination = LanguageCombination.objects.create(
            translator=self.translator,
            source_language="English",
            target_language="Spanish",
            services="Translation, Proofreading",
            price_per_word=0.05,
            sworn_price_per_word=0.10,
            price_per_hour=25.00
        )

    def test_combination_creation(self):
        self.assertEqual(self.combination.translator, self.translator)
        self.assertEqual(self.combination.source_language, "English")
        self.assertEqual(self.combination.target_language, "Spanish")

    def test_str_method(self):
        expected_str = "English → Spanish (Translation, Proofreading)"
        self.assertEqual(str(self.combination), expected_str)

class FilesModelTest(TestCase):
    def setUp(self):
        self.translator = Translator.objects.create_user(
            email="testfiles@example.com",
            password="securepassword",
            first_name="Files",
            last_name="User"
        )
        self.files = Files.objects.create(
            translator=self.translator,
            cv_file="dummy/path/cv.pdf",
            voice_note="dummy/path/voice.mp3"
        )

    def test_files_creation(self):
        self.assertEqual(self.files.translator, self.translator)
        self.assertEqual(self.files.cv_file, "dummy/path/cv.pdf")
        self.assertEqual(self.files.voice_note, "dummy/path/voice.mp3")

    def test_str_method(self):
        self.assertEqual(str(self.files), f"Currículum de {self.translator.email}")

    def test_file_validations(self):
        self.files.cv_file = "dummy/path/cv.txt"
        with self.assertRaises(ValidationError):
            self.files.clean()
