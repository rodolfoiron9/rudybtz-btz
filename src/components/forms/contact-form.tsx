'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setErrorMessage('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!formData.subject.trim()) {
      setErrorMessage('Please select a subject');
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Message is required');
      return false;
    }
    if (formData.message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // API call to send email - this will be implemented by Gemini
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
      
      onSuccess?.();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Contact form submission error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.subject && formData.message;

  return (
    <Card className="bg-gray-900/50 border-rose-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-3d-silver-violet silver-violet text-2xl">Send a Message</CardTitle>
        <CardDescription className="text-gray-300">
          Get in touch for bookings, collaborations, or general inquiries
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                First Name *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Your first name"
                className="bg-gray-800/50 border-rose-500/30 text-white placeholder-gray-400"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                Last Name *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Your last name"
                className="bg-gray-800/50 border-rose-500/30 text-white placeholder-gray-400"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className="bg-gray-800/50 border-rose-500/30 text-white placeholder-gray-400"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
              Subject *
            </Label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              title="Select inquiry subject"
              className="w-full p-3 bg-gray-800/50 border border-rose-500/30 rounded-md text-white disabled:opacity-50"
              disabled={isSubmitting}
              required
            >
              <option value="">Select a subject</option>
              <option value="booking">Event Booking</option>
              <option value="collaboration">Music Collaboration</option>
              <option value="interview">Interview Request</option>
              <option value="remix">Remix Request</option>
              <option value="licensing">Music Licensing</option>
              <option value="press">Press & Media</option>
              <option value="general">General Inquiry</option>
              <option value="technical">Technical Support</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message *
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell me about your project, event, or inquiry..."
              rows={6}
              className="bg-gray-800/50 border-rose-500/30 text-white placeholder-gray-400"
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.message.length} characters (minimum 10 required)
            </p>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                Message sent successfully! I'll get back to you within 24 hours.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && errorMessage && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-black font-bold text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </Button>

          {/* Form Info */}
          <div className="text-center text-sm text-gray-400">
            <p>
              All fields marked with * are required. 
              Your information is secure and will only be used to respond to your inquiry.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}