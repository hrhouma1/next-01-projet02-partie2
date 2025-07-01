'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface InvoiceFormData {
  customer: string;
  email: string;
  value: string;
  description: string;
}

export default function NewInvoicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InvoiceFormData>();

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage('Facture créée avec succès !');
        reset();
      } else {
        const error = await response.json();
        setSubmitMessage(`Erreur : ${error.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      setSubmitMessage('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Créer une nouvelle facture
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nom du client */}
            <div>
              <Label htmlFor="customer" className="block font-semibold text-sm mb-2">
                Nom du client *
              </Label>
              <Input
                id="customer"
                type="text"
                className="w-full"
                {...register('customer', { 
                  required: 'Le nom du client est requis',
                  minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                })}
              />
              {errors.customer && (
                <p className="text-red-500 text-sm mt-1">{errors.customer.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block font-semibold text-sm mb-2">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                className="w-full"
                {...register('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email invalide'
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Montant */}
            <div>
              <Label htmlFor="value" className="block font-semibold text-sm mb-2">
                Montant (€) *
              </Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0.01"
                className="w-full"
                {...register('value', { 
                  required: 'Le montant est requis',
                  min: { value: 0.01, message: 'Le montant doit être supérieur à 0' }
                })}
              />
              {errors.value && (
                <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="block font-semibold text-sm mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                rows={4}
                className="w-full"
                {...register('description')}
              />
            </div>

            {/* Message de retour */}
            {submitMessage && (
              <div className={`p-4 rounded-md ${
                submitMessage.includes('succès') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitMessage}
              </div>
            )}

            {/* Bouton de soumission */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold"
            >
              {isSubmitting ? 'Création en cours...' : 'Créer la facture'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}