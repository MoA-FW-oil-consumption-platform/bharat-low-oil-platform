import { Response } from 'express';
import PDFDocument from 'pdfkit';
import UserProgress from '../models/UserProgress.model';
import Module from '../models/Module.model';
import { AuthRequest } from '../middleware/auth';

export const generateCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Verify module completion
    const progress = await UserProgress.findOne({ userId, moduleId });
    if (!progress) {
      res.status(404).json({ error: 'Module progress not found' });
      return;
    }

    if (progress.status !== 'completed') {
      res.status(400).json({ error: 'Module not completed yet' });
      return;
    }

    // Get module details
    const module = await Module.findById(moduleId);
    if (!module) {
      res.status(404).json({ error: 'Module not found' });
      return;
    }

    // Generate certificate ID if not exists
    if (!progress.certificateId) {
      progress.certificateId = `BLOC-${Date.now()}-${userId.substring(0, 8)}`;
      progress.certificateIssuedAt = new Date();
      await progress.save();
    }

    // Create PDF certificate
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${progress.certificateId}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Certificate design
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Border
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke('#10b981');
    doc.rect(35, 35, pageWidth - 70, pageHeight - 70).stroke('#10b981');

    // Header - Government of India
    doc.fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#1e40af')
      .text('GOVERNMENT OF INDIA', 0, 80, { align: 'center' });

    doc.fontSize(16)
      .fillColor('#374151')
      .text('Ministry of Agriculture & Farmers Welfare', 0, 115, { align: 'center' });

    doc.fontSize(14)
      .fillColor('#6b7280')
      .text('Bharat Low Oil Consumption Platform', 0, 140, { align: 'center' });

    // Certificate title
    doc.fontSize(36)
      .font('Helvetica-Bold')
      .fillColor('#10b981')
      .text('CERTIFICATE', 0, 190, { align: 'center' });

    doc.fontSize(14)
      .fillColor('#374151')
      .text('of Achievement', 0, 235, { align: 'center' });

    // Certificate content
    doc.fontSize(16)
      .font('Helvetica')
      .fillColor('#4b5563')
      .text('This certifies that', 0, 280, { align: 'center' });

    doc.fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#1f2937')
      .text(req.user?.email || 'Learner', 0, 315, { align: 'center' });

    doc.fontSize(16)
      .font('Helvetica')
      .fillColor('#4b5563')
      .text('has successfully completed the module', 0, 355, { align: 'center' });

    doc.fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#10b981')
      .text(module.title, 0, 390, { align: 'center', width: pageWidth - 100 });

    // Score and date
    doc.fontSize(14)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text(`Score: ${Math.round(progress.bestScore || 0)}%`, 0, 440, { align: 'center' });

    const issueDate = progress.certificateIssuedAt || new Date();
    doc.text(`Issued on: ${issueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 0, 465, { align: 'center' });

    // Certificate ID
    doc.fontSize(10)
      .fillColor('#9ca3af')
      .text(`Certificate ID: ${progress.certificateId}`, 0, 500, { align: 'center' });

    // Footer signatures (placeholder)
    const footerY = pageHeight - 120;
    
    doc.fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#374151')
      .text('_____________________', 150, footerY);
    
    doc.fontSize(10)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text('Secretary', 150, footerY + 25, { width: 150, align: 'center' });
    
    doc.text('Ministry of Agriculture', 150, footerY + 40, { width: 150, align: 'center' });

    doc.fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#374151')
      .text('_____________________', pageWidth - 300, footerY);
    
    doc.fontSize(10)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text('Program Director', pageWidth - 300, footerY + 25, { width: 150, align: 'center' });
    
    doc.text('Bharat Low Oil Platform', pageWidth - 300, footerY + 40, { width: 150, align: 'center' });

    // Watermark
    doc.fontSize(8)
      .fillColor('#e5e7eb')
      .text('Verify at: bharatlowoil.gov.in/verify/' + progress.certificateId, 0, pageHeight - 50, { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Generate certificate error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate certificate' });
    }
  }
};

export const getCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const progress = await UserProgress.findOne({ userId, moduleId });
    
    if (!progress) {
      res.status(404).json({ error: 'Progress not found' });
      return;
    }

    if (!progress.certificateId) {
      res.status(404).json({ error: 'Certificate not issued yet' });
      return;
    }

    const module = await Module.findById(moduleId);

    res.json({
      success: true,
      data: {
        certificateId: progress.certificateId,
        moduleId: progress.moduleId,
        moduleTitle: module?.title,
        issuedAt: progress.certificateIssuedAt,
        score: progress.bestScore,
        verificationUrl: `bharatlowoil.gov.in/verify/${progress.certificateId}`
      }
    });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
};

export const verifyCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { certificateId } = req.params;

    const progress = await UserProgress.findOne({ certificateId });

    if (!progress) {
      res.status(404).json({
        success: false,
        valid: false,
        message: 'Certificate not found'
      });
      return;
    }

    const module = await Module.findById(progress.moduleId);

    res.json({
      success: true,
      valid: true,
      message: 'Certificate is valid',
      data: {
        certificateId: progress.certificateId,
        moduleTitle: module?.title,
        issuedAt: progress.certificateIssuedAt,
        completedAt: progress.completedAt,
        score: progress.bestScore
      }
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
};

export const getUserCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const certificates = await UserProgress.find({
      userId,
      certificateId: { $exists: true, $ne: null }
    }).sort({ certificateIssuedAt: -1 });

    const certificatesWithModules = await Promise.all(
      certificates.map(async (cert) => {
        const module = await Module.findById(cert.moduleId);
        return {
          certificateId: cert.certificateId,
          moduleId: cert.moduleId,
          moduleTitle: module?.title,
          score: cert.bestScore,
          issuedAt: cert.certificateIssuedAt,
          verificationUrl: `bharatlowoil.gov.in/verify/${cert.certificateId}`
        };
      })
    );

    res.json({
      success: true,
      count: certificatesWithModules.length,
      data: certificatesWithModules
    });
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};
