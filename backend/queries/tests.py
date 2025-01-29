from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import SavedQuery
from django.urls import reverse

User = get_user_model()

class SavedQueryTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="test@email.com",
            password="adminpass",
            is_staff=True,
            postal_code="12345"
        )
        self.query_data = {
            "name": "Test Query",
            "tables": '["Translator", "LanguageCombination"]',
            "fields": '{"Translator": ["email", "first_name"], "LanguageCombination": ["source_language"]}',
            "filters": '{"Translator": {"email": "test@example.com"}}',
        }
        self.client.login(email="test@email.com", password="adminpass")

    def test_create_saved_query(self):
        response = self.client.post(reverse('saved_queries_list_create'), self.query_data, content_type="application/json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SavedQuery.objects.count(), 1)

    def test_list_saved_queries(self):
        SavedQuery.objects.create(name="Query 1", tables='["Translator"]', fields='{"Translator": ["email"]}', created_by=self.user)
        response = self.client.get(reverse('saved_queries_list_create'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_invalid_table(self):
        invalid_data = self.query_data.copy()
        invalid_data["tables"] = '["nonexistent_table"]'
        response = self.client.post(reverse('saved_queries_list_create'), invalid_data, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("La tabla 'nonexistent_table' no existe en el sistema.", response.json()["tables"])

    def test_invalid_field(self):
        invalid_data = self.query_data.copy()
        invalid_data["fields"] = '{"Translator": ["nonexistent_field"]}'
        response = self.client.post(reverse('saved_queries_list_create'), invalid_data, content_type="application/json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("El campo 'nonexistent_field' no existe en la tabla 'Translator'.", response.json()["fields"])
