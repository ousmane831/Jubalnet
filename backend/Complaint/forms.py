from django import forms

from .models import Complaint

class ComplaintForm(forms.ModelForm):
    attachments = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}), required=False)

    class Meta:
        model = Complaint
        fields = [
            'plaintiff_first_name', 'plaintiff_last_name', 'plaintiff_birth_date',
            'plaintiff_birth_place', 'plaintiff_nationality', 'plaintiff_address',
            'plaintiff_city', 'plaintiff_postal_code', 'facts', 'complaint_city'
        ]
