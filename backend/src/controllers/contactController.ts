import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validateRequest';
import { contactSchema } from '../schemas/contactSchema';

const prisma = new PrismaClient();

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create contact submission
    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // TODO: Send email notification to admin
    // This could be implemented using a service like SendGrid or Nodemailer

    res.status(201).json({
      message: 'Contact form submitted successfully',
      submission: contactSubmission,
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error submitting contact form' });
  }
};

export const getContactSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ message: 'Error fetching contact submissions' });
  }
};

export const deleteContactSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.contactSubmission.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    res.status(500).json({ message: 'Error deleting contact submission' });
  }
}; 