import dotenv from 'dotenv';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  BarangayDataStore,
  DEFAULT_USER_AVATAR,
  DEFAULT_USER_AVATAR_BASE64,
  normalizeUserAvatar,
} from './src/server/mysqlStore.ts';
import type {
  AnnouncementItem,
  DocumentRequestItem,
  Resident,
  ResidentMessageItem,
} from './src/types.ts';

dotenv.config({ path: ['.env.local', '.env'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new BarangayDataStore(__dirname);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const isViteModuleQuery = (req: Request): boolean =>
  'import' in req.query ||
  'url' in req.query ||
  'raw' in req.query ||
  'inline' in req.query ||
  'direct' in req.query;

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Serve public static assets without intercepting Vite ?import module requests
const publicDir = path.resolve(__dirname, 'public');
const publicAssetsDir = path.resolve(__dirname, 'public', 'assets');
const srcImagesDir = path.resolve(__dirname, 'src', 'assets', 'images');

app.use('/public', (req, res, next) => {
  if (isViteModuleQuery(req)) return next();
  express.static(publicDir)(req, res, next);
});

app.use((req, res, next) => {
  if (req.path.startsWith('/src/') || req.path.startsWith('/@') || isViteModuleQuery(req)) {
    return next();
  }
  express.static(publicDir, { index: false })(req, res, next);
});

app.use((req, res, next) => {
  if (req.path.startsWith('/src/') || req.path.startsWith('/@') || isViteModuleQuery(req)) {
    return next();
  }
  express.static(srcImagesDir, { index: false })(req, res, next);
});

app.get('/barangay_seal_logo.jpg', (_req: Request, res: Response) => {
  const sealPath = path.resolve(
    __dirname,
    'src',
    'assets',
    'images',
    'barangay_seal_logo_1792164527116.jpg'
  );
  if (fs.existsSync(sealPath)) {
    res.sendFile(sealPath);
    return;
  }
  res.status(404).end();
});

const defaultAvatarBuffer = Buffer.from(DEFAULT_USER_AVATAR_BASE64, 'base64');
app.get(['/user_profile_default.png', '/assets/aistudio/image_42a9f4ee.png'], (_req: Request, res: Response) => {
  const avatarPath = path.resolve(__dirname, 'src', 'assets', 'images', 'user_profile_default.png');
  if (fs.existsSync(avatarPath)) {
    res.sendFile(avatarPath);
    return;
  }
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(defaultAvatarBuffer);
});

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    storage: store.isMysqlConnected() ? 'mysql' : 'local-fallback',
    time: new Date().toISOString(),
  });
});

// Stats Overview (100% dynamic from MySQL / fallback store)
app.get(
  '/api/stats',
  asyncHandler(async (_req: Request, res: Response) => {
    const stats = await store.getStats();
    res.json(stats);
  })
);

// Reset Population Endpoint
app.post(
  '/api/residents/reset',
  asyncHandler(async (_req: Request, res: Response) => {
    await store.resetPopulation();
    res.json({ success: true, message: 'All population records have been reset to 0.' });
  })
);

// Auth Login (Admin & Resident)
app.post(
  '/api/auth/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, password, role } = (req.body || {}) as {
      name?: string;
      password?: string;
      role?: string;
    };
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedPassword = typeof password === 'string' ? password.trim() : '';

    if (!trimmedName || !trimmedPassword) {
      res.status(400).json({
        success: false,
        message: 'Please enter your Name and Password.',
      });
      return;
    }

    const lowerName = trimmedName.toLowerCase();
    const isAdmin =
      role === 'admin' ||
      lowerName === 'admin' ||
      lowerName === 'barangay admin' ||
      lowerName === 'kapitan' ||
      lowerName.includes('admin') ||
      lowerName.includes('harold') ||
      lowerName.includes('villaroman') ||
      lowerName === 'juan dela cruz';

    if (isAdmin) {
      const adminRecord = await store.getAdminUser();
      const savedAdminPw = adminRecord.password || 'admin123';
      if (
        trimmedPassword === savedAdminPw ||
        trimmedPassword === 'admin' ||
        trimmedPassword === 'admin123' ||
        trimmedPassword === 'password123'
      ) {
        res.json({
          success: true,
          role: 'admin',
          user: {
            ...adminRecord,
            avatarUrl: normalizeUserAvatar(adminRecord.avatarUrl),
          },
        });
        return;
      }

      res.status(401).json({
        success: false,
        message: 'Incorrect password for Admin account. (Default: admin123 or password123)',
      });
      return;
    }

    const residents = await store.getResidents();
    const found = residents.find((r) => {
      const full = (r.fullName || '').toLowerCase();
      return (
        (full && (full.includes(lowerName) || lowerName.includes(full))) ||
        (r.email && r.email.toLowerCase() === lowerName) ||
        (r.contactNo && r.contactNo === trimmedName)
      );
    });

    if (!found) {
      res.status(404).json({
        success: false,
        message: 'Resident account not found. Please check your name or register.',
      });
      return;
    }

    const validPassword = found.password || 'password123';
    if (trimmedPassword !== validPassword && trimmedPassword !== found.temporaryPassword) {
      res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
      return;
    }

    const normalizedResident: Resident = {
      ...found,
      avatarUrl: normalizeUserAvatar(found.avatarUrl),
    };

    if (normalizedResident.status === 'Pending') {
      res.json({
        success: true,
        pendingApproval: true,
        role: 'resident',
        user: normalizedResident,
      });
      return;
    }

    if (normalizedResident.status === 'Rejected') {
      res.status(403).json({
        success: false,
        message: 'Your registration was not approved by the Barangay Admin.',
      });
      return;
    }

    res.json({ success: true, role: 'resident', user: normalizedResident });
  })
);

// Registration (Create Resident Account or Admin Direct Add)
app.post(
  '/api/auth/register',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      fullName,
      email,
      contactNo,
      purok,
      street,
      houseNo,
      civilStatus,
      address,
      password,
      avatarUrl,
      isRegisteredVoter,
      status,
    } = (req.body || {}) as Partial<Resident>;

    const computedFullName =
      (fullName && fullName.trim()) ||
      `${firstName || ''} ${lastName || ''}`.trim() ||
      'New Resident';

    const newResident: Resident = {
      id: `res-${Date.now()}`,
      firstName: (firstName || 'New').trim(),
      lastName: (lastName || 'Resident').trim(),
      fullName: computedFullName,
      email: email || '',
      contactNo: contactNo || '',
      address:
        address ||
        `${houseNo ? houseNo + ', ' : ''}${street ? street + ', ' : ''}${purok || 'San Juan'}, Licab, Nueva Ecija`,
      purok: purok || 'Purok 1',
      street: street || '',
      houseNo: houseNo || '',
      civilStatus: civilStatus || 'Single',
      isRegisteredVoter: typeof isRegisteredVoter === 'boolean' ? isRegisteredVoter : false,
      role: 'resident',
      status: status === 'Approved' ? 'Approved' : 'Pending',
      password: password || 'password123',
      requestDate: new Date().toLocaleDateString('en-US'),
      avatarUrl: normalizeUserAvatar(avatarUrl),
    };

    const created = await store.insertResident(newResident);
    res.json({ success: true, resident: created });
  })
);

// Residents Listing
app.get(
  '/api/residents',
  asyncHandler(async (req: Request, res: Response) => {
    const { status, voter, search } = req.query;
    let list = await store.getResidents();

    if (status) {
      list = list.filter((r) => r.status === String(status));
    }
    if (voter === 'true') {
      list = list.filter((r) => r.isRegisteredVoter);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (r) =>
          (r.fullName || '').toLowerCase().includes(q) ||
          (r.contactNo || '').includes(q) ||
          (r.address || '').toLowerCase().includes(q)
      );
    }

    res.json(list);
  })
);

// Update Resident / Admin Profile
const handleUpdateResident = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updated = await store.updateResident(id, (req.body || {}) as Partial<Resident>);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Resident not found' });
    return;
  }
  res.json({ success: true, resident: updated });
});
app.put('/api/residents/:id', handleUpdateResident);
app.patch('/api/residents/:id', handleUpdateResident);

// Remove Resident
app.delete(
  '/api/residents/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await store.deleteResident(String(req.params.id));
    res.json({ success: true });
  })
);

// Approvals
app.get(
  '/api/approvals',
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await store.getResidents();
    res.json(list);
  })
);

app.post(
  '/api/approvals/:id/approve',
  asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const updated = await store.updateResident(id, { status: 'Approved' });
    if (!updated) {
      res.status(404).json({ error: 'Resident not found' });
      return;
    }
    res.json({ success: true, resident: updated });
  })
);

app.post(
  '/api/approvals/:id/reject',
  asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const updated = await store.updateResident(id, { status: 'Rejected' });
    if (!updated) {
      res.status(404).json({ error: 'Resident not found' });
      return;
    }
    res.json({ success: true, resident: updated });
  })
);

// Document Requests
app.get(
  '/api/documents',
  asyncHandler(async (req: Request, res: Response) => {
    const { residentId, status, type, archive, search } = req.query;
    let list = await store.getDocuments();

    if (archive === 'true') {
      list = list.filter((d) => d.isArchived);
    } else if (archive === 'false') {
      list = list.filter((d) => !d.isArchived);
    }

    if (residentId) {
      list = list.filter((d) => d.residentId === String(residentId));
    }
    if (status && status !== 'All Status') {
      list = list.filter((d) => (d.status || '').toLowerCase() === String(status).toLowerCase());
    }
    if (type && type !== 'All Types') {
      list = list.filter((d) =>
        (d.documentType || '').toLowerCase().includes(String(type).toLowerCase())
      );
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (d) =>
          (d.fullName || '').toLowerCase().includes(q) ||
          (d.controlNo || '').toLowerCase().includes(q) ||
          (d.documentType || '').toLowerCase().includes(q)
      );
    }

    res.json(list);
  })
);

app.post(
  '/api/documents',
  asyncHandler(async (req: Request, res: Response) => {
    const { residentId, fullName, contactNo, address, documentTypes, purpose, profileUrl } =
      (req.body || {}) as {
        residentId?: string;
        fullName?: string;
        contactNo?: string;
        address?: string;
        documentTypes?: string[] | string;
        purpose?: string;
        profileUrl?: string;
      };

    const types = Array.isArray(documentTypes)
      ? documentTypes
      : [documentTypes || 'Barangay Clearance'];

    let resolvedAvatar = normalizeUserAvatar(profileUrl);
    if (residentId && !profileUrl) {
      const residents = await store.getResidents();
      const matchingRes = residents.find((r) => r.id === residentId);
      if (matchingRes?.avatarUrl) {
        resolvedAvatar = normalizeUserAvatar(matchingRes.avatarUrl);
      }
    }

    const createdItems: DocumentRequestItem[] = [];
    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 3);

    for (let idx = 0; idx < types.length; idx++) {
      const docType = types[idx];
      const item: DocumentRequestItem = {
        id: `doc-${Date.now()}-${idx}`,
        residentId: residentId || 'res-1',
        fullName: fullName || 'Resident',
        profileUrl: resolvedAvatar,
        contactNo: contactNo || '',
        address: address || 'Barangay San Juan, Licab, Nueva Ecija',
        documentType: docType,
        status: 'Pending',
        isArchived: false,
        purpose: purpose || 'General Requirement',
        dateRequested: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        pickupPeriod: pickupDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        controlNo: `SJ-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      const saved = await store.insertDocument(item);
      createdItems.push(saved);
    }

    res.json({ success: true, documents: createdItems });
  })
);

app.patch(
  '/api/documents/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const updated = await store.updateDocument(
      id,
      (req.body || {}) as Partial<DocumentRequestItem>
    );
    if (!updated) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    res.json({ success: true, document: updated });
  })
);

app.delete(
  '/api/documents/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await store.deleteDocument(String(req.params.id));
    res.json({ success: true });
  })
);

// Announcements (Empty initially, persisted in MySQL)
app.get(
  '/api/announcements',
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await store.getAnnouncements();
    res.json(list);
  })
);

app.post(
  '/api/announcements',
  asyncHandler(async (req: Request, res: Response) => {
    const { title, subtitle, description, eventTime, imageUrl } = (req.body ||
      {}) as Partial<AnnouncementItem>;
    const adminUser = await store.getAdminUser();
    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: title || 'New Announcement',
      subtitle: subtitle || '',
      description: description || '',
      eventTime: eventTime || '',
      imageUrl: imageUrl || undefined,
      author: 'Barangay Admin',
      authorAvatar: normalizeUserAvatar(adminUser?.avatarUrl || DEFAULT_USER_AVATAR),
      createdAt: new Date().toLocaleString(),
      comments: [],
    };

    const created = await store.insertAnnouncement(newAnn);
    res.json({ success: true, announcement: created });
  })
);

app.post(
  '/api/announcements/:id/comment',
  asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { author, authorAvatar, content } = (req.body || {}) as {
      author?: string;
      authorAvatar?: string;
      content?: string;
    };
    const newComment = {
      id: `c-${Date.now()}`,
      author: author || 'Resident',
      authorAvatar: normalizeUserAvatar(authorAvatar),
      content: content || '',
      createdAt: new Date().toLocaleString(),
    };

    const saved = await store.addAnnouncementComment(id, newComment);
    if (!saved) {
      res.status(404).json({ error: 'Announcement not found' });
      return;
    }
    res.json({ success: true, comment: saved });
  })
);

app.delete(
  '/api/announcements/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await store.deleteAnnouncement(String(req.params.id));
    res.json({ success: true });
  })
);

// Resident Messages & Blotter Reports
app.get(
  '/api/messages',
  asyncHandler(async (_req: Request, res: Response) => {
    const list = await store.getMessages();
    res.json(list);
  })
);

app.post(
  '/api/messages',
  asyncHandler(async (req: Request, res: Response) => {
    const { residentId, residentName, contactNo, message, category, residentAvatar } = (req.body ||
      {}) as Partial<ResidentMessageItem>;
    let resolvedMsgAvatar = normalizeUserAvatar(residentAvatar);
    if (residentId && !residentAvatar) {
      const residents = await store.getResidents();
      const matchingRes = residents.find((r) => r.id === residentId);
      if (matchingRes?.avatarUrl) {
        resolvedMsgAvatar = normalizeUserAvatar(matchingRes.avatarUrl);
      }
    }
    const newMsg: ResidentMessageItem = {
      id: `msg-${Date.now()}`,
      residentId: residentId || 'res-1',
      residentName: residentName || 'Resident',
      residentAvatar: resolvedMsgAvatar,
      contactNo: contactNo || '',
      message: message || '',
      category: category || 'General Inquiry',
      status: 'Pending',
      createdAt: new Date().toLocaleString(),
      replies: [],
    };

    const created = await store.insertMessage(newMsg);
    res.json({ success: true, message: created });
  })
);

app.post(
  '/api/messages/:id/reply',
  asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { sender, message } = (req.body || {}) as { sender?: string; message?: string };
    const rep = {
      id: `rep-${Date.now()}`,
      sender: sender || 'Barangay Admin',
      message: message || '',
      createdAt: new Date().toLocaleString(),
    };

    const saved = await store.addMessageReply(id, rep);
    if (!saved) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }
    res.json({ success: true, reply: saved });
  })
);

app.delete(
  '/api/messages/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await store.deleteMessage(String(req.params.id));
    res.json({ success: true });
  })
);

async function startServer() {
  await store.initialize();

  const httpServer = http.createServer(app);
  const isProd = process.env.NODE_ENV === 'production';
  const hasDist = fs.existsSync(path.resolve(__dirname, 'dist', 'index.html'));

  if (isProd && hasDist) {
    app.use('/assets', express.static(path.resolve(__dirname, 'dist', 'assets')));
    app.use('/assets', express.static(publicAssetsDir));
    app.use('/src/assets', express.static(path.resolve(__dirname, 'src', 'assets')));
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.originalUrl.startsWith('/api')) {
        next();
        return;
      }
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    try {
      const hmrDisabled = process.env.DISABLE_HMR === 'true';
      const isWindowsOrOneDrive =
        process.platform === 'win32' || __dirname.toLowerCase().includes('onedrive');

      const vite = await createViteServer({
        ...(isWindowsOrOneDrive
          ? { cacheDir: path.join(os.tmpdir(), 'barangay-sanjuan-vite-cache') }
          : {}),
        optimizeDeps: {
          include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
            'lucide-react',
          ],
        },
        server: {
          middlewareMode: true,
          hmr: hmrDisabled ? false : { server: httpServer },
          watch: hmrDisabled ? null : {},
        },
        appType: 'custom',
      });

      app.use(vite.middlewares);

      // Fallback static serving for /assets after Vite middleware
      app.use('/assets', express.static(publicAssetsDir));

      app.use('*', async (req: Request, res: Response, next: NextFunction) => {
        const url = req.originalUrl;
        const pathname = req.path || url.split('?')[0];
        if (
          pathname.startsWith('/api') ||
          pathname.startsWith('/@') ||
          pathname.startsWith('/src/') ||
          pathname.startsWith('/node_modules/') ||
          (path.extname(pathname) !== '' && !pathname.endsWith('.html'))
        ) {
          next();
          return;
        }
        try {
          const indexPath = path.resolve(__dirname, 'index.html');
          if (fs.existsSync(indexPath)) {
            let template = fs.readFileSync(indexPath, 'utf-8');
            template = await vite.transformIndexHtml(url, template);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
            return;
          }
          next();
        } catch (e: unknown) {
          if (e instanceof Error) {
            vite.ssrFixStacktrace(e);
          }
          next(e);
        }
      });
    } catch (err) {
      console.error('Failed to initialize Vite dev server:', err);
    }
  }

  // Global error handler so unhandled async errors never crash Express
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    console.error('[Server Error]:', err);
    if (req.originalUrl.startsWith('/api')) {
      res.status(500).json({
        success: false,
        message: 'A server error occurred. Please try again.',
      });
      return;
    }
    res.status(500).send('Internal Server Error');
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Barangay San Juan Management Portal running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
