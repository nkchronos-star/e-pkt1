import re

with open('src/components/dashboard/EditCandidateModal.tsx', 'r') as f:
    content = f.read()

# Instead of updating firestore directly in the component, let's use the updateCandidate function
# from the useAppContext. This ensures the UI updates instantly and avoids permission issues
# if the security rules don't allow direct document writes from this context.

replacement = r"""
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Candidate } from '../../types';
import { useAppContext } from '../../store';

export default function EditCandidateModal({ candidate, onClose, onUpdated }: { candidate: Candidate, onClose: () => void, onUpdated: () => void }) {
  const { updateCandidate } = useAppContext();
  const [formData, setFormData] = useState({
    name: candidate.name || '',
    ic: candidate.ic || '',
    alamat1: candidate.alamat1 || '',
    alamat2: candidate.alamat2 || '',
    poskod: candidate.poskod || '',
    daerah: candidate.daerah || '',
    negeri: candidate.negeri || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (candidate.ic) {
         // Use the central store update function which handles API calls properly
         await updateCandidate(candidate.ic, {
           name: formData.name,
           ic: formData.ic,
           alamat1: formData.alamat1,
           alamat2: formData.alamat2,
           poskod: formData.poskod,
           daerah: formData.daerah,
           negeri: formData.negeri
         });
      } else {
         alert("IC calon tidak dijumpai.");
      }
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Ralat mengemaskini:", error);
      alert('Ralat mengemaskini maklumat.');
    } finally {
      setLoading(false);
    }
  };
"""

content = re.sub(r"import React,.*?const handleSubmit = async \(e: React\.FormEvent\) => \{.*?\};", replacement, content, flags=re.DOTALL)

with open('src/components/dashboard/EditCandidateModal.tsx', 'w') as f:
    f.write(content)
