import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type {
  AnnouncementItem,
  DocumentRequestItem,
  Resident,
  ResidentMessageItem,
  StatsOverview,
} from '../types.ts';

export interface LocalPortalDatabase {
  adminUser: Resident;
  residents: Resident[];
  documentRequests: DocumentRequestItem[];
  announcements: AnnouncementItem[];
  residentMessages: ResidentMessageItem[];
}

export const DEFAULT_USER_AVATAR = '/user_profile_default.png';

export const DEFAULT_USER_AVATAR_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAAAAAB5Gfe6AAAG+klEQVR42u3d7U9TVxwH8DNaSkSi6CgPMnVThpo4WQ06R1GxaoiJW7IlmlEgbBP3CjFGs8VFedI4o3G6sCqLmUqGOp8QxCLZG5+YSpQXw+JGnK1OQUVEagVBlN9i9moPTtrec+753fv7/AffL/Tec88951zGCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCFFCSGzakrWlFUePHz9aUbo2Ny0uREfhh9gKa9vgH9pqC23hekgfmXWoC17Aezg7UuP/+NbdPvhfvj2p2v0xmOwNMAgNdpMm4xsyLsMguTIM2ss/ox78UJ+itUtfaT/4pd+hqcvhHDf4zT1HOxe/4l4IQF+xRi6G5hoIkNOshfzjXRAwVwL+/Em3IAitFuz5p9+FoLTPQP73DzI/wN23Uf/+b0HQWhFfB8wuUIAL7b3AVAOKcGIdDxSDQkqQjn97lSqgz4by+ccNivFgfDIqBQU5ED7/9ytZQD+6+QFDPSjqHLY5ogxQmB3ZEOCy0gW4wlAVYAfQ9b9ASIPyBVzEdBWwAgezEBWwm0cB5YgGgT4eBfhGoikgC7jIQVPAIT4FHMGSf0gXnwK8WNYP2ICTuUgKKORVQBGSAmp5FVCHZBjYxquA2zgGg7HATTyKAtL4FYBjbnAJvwJyURSwll8BhfqbDcU4N1rBr4AKFAUc5VdAFYoCjvMrwEkF0E9A3xfBvXQb1PlACMfzcK7eh8K6fxiK0/vjML8JkTtI3o7pfUqMJkV1Py0e7uX0YmQokgLYYT4FVGLJz7L1/nJU96/H2R6dL5BgqTwKmI2oAB6LpC6hWirJYZlcJqb8zORSOv8VXAsldb9UVvnF0kZkBbAUZZfLWxk6DiUL2I4vv7JbZkYgLIDN6VMqP85NUwpum1uHMz8zOZXJX4v2IAVlts42RzO0ElqDz9+WyBCzBL19vn0qQ21GsAcovMuQswT1K2ibytBLCOJK2JzINMAc8N2wNpppgqkkoDFh3zrtnCpn8wQw/rcxDYl0+HuY2vYRTFtSzvk1/2FlmmOwNw96/s9uZFoUZr84qPnvzDCmVYZZ5S87VLV8loFp2sicIy98e+6tzBnJdCB8blHd7X9tiKormjuU6Ych3pZb6Kiocjqr9jqKcm3xBkYIIYQQQgghROsiJ6UtWrqy4Kst27Zt2ViwcumitEmR+kgebslaf+BSx39Nh9xvPLA+y6Lhjy2FjMt2NHa/bEawu9GRnaDBTw1FZX7vHhjsrPCAe1dmlJbSj1tx0u9TpntPrRyvjfQxeWcGAns3OnA2LxZ7+tD0Qz3BrA/oOZweivlmt6Il+DVCLSuw3iDHbLqvzDK5zs1jEMYf++0j5ZbKdjteRxY/9msF4z/3aGscovhDV3cqv2Wm88sILPk/uMpn4+TVD3GMeqr5HaBwTP6xUWi+FzjyLpd8WPDmKeDstNRLBz/tAu66lsg78NsLQuyTdGiY1AyCXJHyA2wfeUGYhxnSxTeu7weBnm6QbCFdxEEQ7KBU48LoMyDcWYmWko9uAhVcHitL/sTfQRXXJBkTTbgOKrkxUYq//w1QzU0J/gded4OKPG+onT/OBaq6ovJE0bDzoLLzw9XMH1YNqqtRc3fBVpDAN+rlzwUpfKZW/pRuOQroVmmHVYwHJHFdlVuB0QnSOKHGVOnnIJEvxOdP7pGpgJ7pwt9+/QJSaRI9P7IBJLNRbP5pj2Ur4LHQH0FYA0jnosghcR5IKF/gM3CHjAV0iBsO7QApfScq/5ReOQvoTRJUQBVIqlpMfutTWQt4liqkgDqQ1k9CZgGeyVvAQKqerwDPHeOf/61+mQt4OoV7AWUgNe5jgWif3AX4eL80T7wtdwF3JvD+F0hqlTl/m4DB4IRr8uZ3C3lfPrZJ1vxNgtaMmE/Kmf+0WdiM6D4Z8+8XOC9qLJbugehZidiVg5kP5cr/MEv4ixG3VJf/ZPGvhqJr5MnvjFHj7ahpjSRTY70Fam0jmS3Fz8Cj4je4ovZLcPdTd6N9Zru68e9lvcLU9VqlmvkrRzP1Zaj2fNgqyfe3Xt3Rp0b8J2XyHLMxrV58/p/fYRIxZgteMubJkW0LacTqe+Lid6yRcSd51EZBG+e8m8xMTqM2CajAu3kUk1dM8V2+8duLZT9ZZ/iyX/nF/235cCa/0PecXMYFfbXvozlTaHyx4ndFTwmuk7VM6XseKJf+QXk6wk/uRCzer0gHD35cHMGQilhYFuRvwVO2EG36vxgm51cHeKTW/WP5k7Xx3YWw5LwfWvw6U2+gpWJZssY+NmOev2rXhUGcMNV5Ydeq+WamUca4mR8X7DzR+Ifvyd9j9/tuNp7YWfjJzLhQpgumYfETLVbbvAUL5tmslonxw0yMEEIIIYQQQogwfwK+uyKayWHA2wAAAABJRU5ErkJggg==';

export function normalizeUserAvatar(raw: unknown): string {
  if (typeof raw !== 'string') return DEFAULT_USER_AVATAR;
  const trimmed = raw.trim();
  if (
    !trimmed ||
    trimmed === `data:image/png;base64,${DEFAULT_USER_AVATAR_BASE64}` ||
    trimmed.includes('user_profile_default') ||
    trimmed.includes('image_42a9f4ee') ||
    trimmed.includes('/assets/aistudio/') ||
    trimmed.includes('filipino_male_resident') ||
    trimmed.includes('filipino_female_resident') ||
    trimmed.includes('barangay_seal') ||
    trimmed.includes('unsplash.com') ||
    trimmed.includes('pravatar') ||
    trimmed.includes('ui-avatars') ||
    trimmed.includes('dicebear') ||
    trimmed.includes('randomuser') ||
    trimmed.includes('4bafadd7-9cc1-4a66-84be-729df7b21bfa')
  ) {
    return DEFAULT_USER_AVATAR;
  }
  return trimmed;
}

export const DEFAULT_ADMIN_USER: Resident = {
  id: 'admin-1',
  firstName: 'Hon. Harold',
  lastName: 'Villaroman',
  fullName: 'Hon. Harold Villaroman',
  email: 'admin.sanjuan@licab.gov.ph',
  contactNo: '09944258953',
  address: 'Barangay Hall, San Juan, Licab, Nueva Ecija',
  purok: 'Purok 1',
  street: 'Centro',
  houseNo: '1',
  civilStatus: 'Married',
  isRegisteredVoter: true,
  role: 'admin',
  status: 'Approved',
  requestDate: '01/01/2026',
  avatarUrl: DEFAULT_USER_AVATAR,
  password: 'admin123',
};

function createEmptyDatabase(): LocalPortalDatabase {
  return {
    adminUser: { ...DEFAULT_ADMIN_USER },
    residents: [],
    documentRequests: [],
    announcements: [],
    residentMessages: [],
  };
}

function sanitizeDbIdentifier(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_]/g, '');
  return cleaned || 'barangay_sanjuan_db';
}

function normalizeCivilStatus(val: unknown): Resident['civilStatus'] {
  if (val === 'Married' || val === 'Divorce' || val === 'Widowed') {
    return val;
  }
  return 'Single';
}

function normalizeResidentStatus(val: unknown): Resident['status'] {
  if (val === 'Approved' || val === 'Rejected') {
    return val;
  }
  return 'Pending';
}

function normalizeDocStatus(val: unknown): DocumentRequestItem['status'] {
  if (
    val === 'In Process' ||
    val === 'Ready for Pickup' ||
    val === 'Completed' ||
    val === 'Rejected'
  ) {
    return val;
  }
  return 'Pending';
}

function normalizeMsgStatus(val: unknown): ResidentMessageItem['status'] {
  if (val === 'Under Review' || val === 'Resolved') {
    return val;
  }
  return 'Pending';
}

export class BarangayDataStore {
  private pool: Pool | null = null;
  private lastConnectAttempt = 0;
  private loggedFallbackWarning = false;
  private fallbackDb: LocalPortalDatabase;
  private readonly dataDir: string;
  private readonly dbFile: string;

  constructor(baseDir: string) {
    this.dataDir = path.join(baseDir, 'data');
    this.dbFile = path.join(this.dataDir, 'barangay-db.json');
    this.fallbackDb = this.loadFallbackJson();
  }

  private loadFallbackJson(): LocalPortalDatabase {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      if (fs.existsSync(this.dbFile)) {
        const raw = fs.readFileSync(this.dbFile, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<LocalPortalDatabase>;
        const validResidents =
          Array.isArray(parsed.residents) &&
          parsed.residents.every((r) => r && typeof r.fullName === 'string');
        if (
          parsed &&
          validResidents &&
          Array.isArray(parsed.documentRequests) &&
          Array.isArray(parsed.announcements) &&
          Array.isArray(parsed.residentMessages)
        ) {
          const normalizedDb: LocalPortalDatabase = {
            adminUser: parsed.adminUser
              ? {
                  ...parsed.adminUser,
                  avatarUrl: normalizeUserAvatar(parsed.adminUser.avatarUrl),
                }
              : { ...DEFAULT_ADMIN_USER },
            residents: (parsed.residents as Resident[]).map((r) => ({
              ...r,
              avatarUrl: normalizeUserAvatar(r.avatarUrl),
            })),
            documentRequests: parsed.documentRequests.map((d) => ({
              ...d,
              profileUrl: normalizeUserAvatar(d.profileUrl),
            })),
            announcements: parsed.announcements.map((a) => ({
              ...a,
              authorAvatar: normalizeUserAvatar(a.authorAvatar),
              comments: Array.isArray(a.comments)
                ? a.comments.map((c) => ({
                    ...c,
                    authorAvatar: normalizeUserAvatar(c.authorAvatar),
                  }))
                : [],
            })),
            residentMessages: parsed.residentMessages.map((m) => ({
              ...m,
              residentAvatar: normalizeUserAvatar(m.residentAvatar),
            })),
          };
          this.saveFallbackJson(normalizedDb);
          return normalizedDb;
        }
      }
    } catch (err) {
      console.warn('Initializing fresh local JSON fallback database:', err);
    }

    const fresh = createEmptyDatabase();
    this.saveFallbackJson(fresh);
    return fresh;
  }

  private saveFallbackJson(db: LocalPortalDatabase): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      const serialized = JSON.stringify(db, null, 2);
      const tmp = `${this.dbFile}.tmp`;
      try {
        fs.writeFileSync(tmp, serialized, 'utf-8');
        fs.renameSync(tmp, this.dbFile);
      } catch {
        // Fallback direct write when Windows OneDrive locks renameSync
        fs.writeFileSync(this.dbFile, serialized, 'utf-8');
        if (fs.existsSync(tmp)) {
          try {
            fs.unlinkSync(tmp);
          } catch {}
        }
      }
    } catch (err) {
      console.error('Failed to persist fallback JSON database:', err);
    }
  }

  public isMysqlConnected(): boolean {
    return this.pool !== null;
  }

  public async initialize(): Promise<void> {
    await this.ensurePool(true);
  }

  private async ensurePool(force = false): Promise<Pool | null> {
    if (this.pool) {
      return this.pool;
    }

    const now = Date.now();
    if (!force && now - this.lastConnectAttempt < 5000) {
      return null;
    }
    this.lastConnectAttempt = now;

    const configuredHost = (process.env.MYSQL_HOST || '127.0.0.1').trim();
    const port = Number(process.env.MYSQL_PORT) || 3306;
    const user = (process.env.MYSQL_USER || 'root').trim();
    const password = process.env.MYSQL_PASSWORD ?? '';
    const dbName = sanitizeDbIdentifier(process.env.MYSQL_DATABASE || 'barangay_sanjuan_db');

    const candidateHosts = Array.from(
      new Set(
        configuredHost === 'localhost' || configuredHost === '127.0.0.1'
          ? ['127.0.0.1', 'localhost']
          : [configuredHost, '127.0.0.1']
      )
    );

    for (const host of candidateHosts) {
      try {
        const bootstrapConn = await mysql.createConnection({
          host,
          port,
          user,
          password,
          connectTimeout: 2500,
        });

        await bootstrapConn.query(
          `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        await bootstrapConn.end();

        const pool = mysql.createPool({
          host,
          port,
          user,
          password,
          database: dbName,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          connectTimeout: 2500,
        });

        await this.ensureSchema(pool);
        this.pool = pool;
        console.log(
          `[MySQL] Connected to XAMPP MySQL database "${dbName}" at ${host}:${port} (viewable in phpMyAdmin)`
        );
        return this.pool;
      } catch (err) {
        if (host === candidateHosts[candidateHosts.length - 1] && !this.loggedFallbackWarning) {
          this.loggedFallbackWarning = true;
          const msg = err instanceof Error ? err.message : String(err);
          console.warn(
            `[MySQL] XAMPP MySQL not detected at ${configuredHost}:${port} (${msg}). Using local JSON fallback until MySQL starts.`
          );
        }
      }
    }

    return null;
  }

  private handleMysqlError(err: unknown): void {
    const code = (err as { code?: string })?.code || '';
    if (
      code === 'ECONNREFUSED' ||
      code === 'PROTOCOL_CONNECTION_LOST' ||
      code === 'ETIMEDOUT' ||
      code === 'ECONNRESET'
    ) {
      if (this.pool) {
        this.pool.end().catch(() => {});
        this.pool = null;
      }
    } else {
      console.error('[MySQL Query Warning]:', err);
    }
  }

  private async ensureSchema(pool: Pool): Promise<void> {
    // Auto-migrate if an incompatible legacy schema exists in the same database
    try {
      const hasRequiredCol = async (table: string, col: string): Promise<boolean> => {
        const [tbl] = await pool.query<RowDataPacket[]>(`SHOW TABLES LIKE ?`, [table]);
        if (tbl.length === 0) return true;
        const [cols] = await pool.query<RowDataPacket[]>(
          `SHOW COLUMNS FROM \`${table}\` LIKE ?`,
          [col]
        );
        return cols.length > 0;
      };

      const schemaValid =
        (await hasRequiredCol('residents', 'full_name')) &&
        (await hasRequiredCol('residents', 'created_at')) &&
        (await hasRequiredCol('document_requests', 'document_type')) &&
        (await hasRequiredCol('document_requests', 'is_archived')) &&
        (await hasRequiredCol('announcements', 'sort_ts')) &&
        (await hasRequiredCol('resident_messages', 'sort_ts'));

      if (!schemaValid) {
        await pool.query(`SET FOREIGN_KEY_CHECKS = 0`);
        try {
          await pool.query(
            `DROP TABLE IF EXISTS system_meta, staff_users, blotter_cases, barangay_officials, emergency_hotlines, announcement_comments, message_replies, resident_messages, announcements, document_requests, residents`
          );
        } finally {
          await pool.query(`SET FOREIGN_KEY_CHECKS = 1`);
        }
      }
    } catch {
      // Safe to proceed to CREATE TABLE IF NOT EXISTS
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(64) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        full_name VARCHAR(180) NOT NULL,
        email VARCHAR(150) NOT NULL,
        contact_no VARCHAR(40) NOT NULL,
        address VARCHAR(255) NOT NULL,
        purok VARCHAR(80) NOT NULL DEFAULT 'Purok 1',
        password VARCHAR(255) NOT NULL DEFAULT 'admin123',
        avatar_url LONGTEXT DEFAULT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS residents (
        id VARCHAR(64) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        full_name VARCHAR(180) NOT NULL,
        email VARCHAR(150) NOT NULL DEFAULT '',
        contact_no VARCHAR(40) NOT NULL DEFAULT '',
        address VARCHAR(255) NOT NULL DEFAULT '',
        purok VARCHAR(80) NOT NULL DEFAULT 'Purok 1',
        street VARCHAR(150) DEFAULT '',
        house_no VARCHAR(60) DEFAULT '',
        civil_status VARCHAR(40) NOT NULL DEFAULT 'Single',
        is_registered_voter TINYINT(1) NOT NULL DEFAULT 0,
        role VARCHAR(20) NOT NULL DEFAULT 'resident',
        status VARCHAR(30) NOT NULL DEFAULT 'Pending',
        request_date VARCHAR(64) NOT NULL,
        avatar_url LONGTEXT DEFAULT NULL,
        password VARCHAR(255) NOT NULL DEFAULT 'password123',
        temporary_password VARCHAR(64) DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_residents_status (status),
        KEY idx_residents_purok (purok)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS document_requests (
        id VARCHAR(64) NOT NULL,
        resident_id VARCHAR(64) NOT NULL,
        full_name VARCHAR(180) NOT NULL,
        profile_url LONGTEXT DEFAULT NULL,
        contact_no VARCHAR(40) NOT NULL DEFAULT '',
        address VARCHAR(255) NOT NULL DEFAULT '',
        document_type VARCHAR(150) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        is_archived TINYINT(1) NOT NULL DEFAULT 0,
        purpose TEXT NOT NULL,
        date_requested VARCHAR(64) NOT NULL,
        pickup_period VARCHAR(64) NOT NULL,
        control_no VARCHAR(64) NOT NULL,
        remarks TEXT DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_doc_resident (resident_id),
        KEY idx_doc_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id VARCHAR(64) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) DEFAULT '',
        description TEXT NOT NULL,
        event_time VARCHAR(150) DEFAULT '',
        image_url LONGTEXT DEFAULT NULL,
        author VARCHAR(150) NOT NULL DEFAULT 'Barangay Admin',
        author_avatar LONGTEXT DEFAULT NULL,
        created_at VARCHAR(64) NOT NULL,
        sort_ts BIGINT NOT NULL DEFAULT 0,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcement_comments (
        id VARCHAR(64) NOT NULL,
        announcement_id VARCHAR(64) NOT NULL,
        author VARCHAR(150) NOT NULL,
        author_avatar LONGTEXT DEFAULT NULL,
        content TEXT NOT NULL,
        created_at VARCHAR(64) NOT NULL,
        sort_ts BIGINT NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        KEY idx_comment_ann (announcement_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS resident_messages (
        id VARCHAR(64) NOT NULL,
        resident_id VARCHAR(64) NOT NULL,
        resident_name VARCHAR(180) NOT NULL,
        resident_avatar LONGTEXT DEFAULT NULL,
        contact_no VARCHAR(40) NOT NULL DEFAULT '',
        message TEXT NOT NULL,
        category VARCHAR(120) NOT NULL DEFAULT 'General Inquiry',
        status VARCHAR(40) NOT NULL DEFAULT 'Pending',
        created_at VARCHAR(64) NOT NULL,
        sort_ts BIGINT NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        KEY idx_msg_resident (resident_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS message_replies (
        id VARCHAR(64) NOT NULL,
        message_id VARCHAR(64) NOT NULL,
        sender VARCHAR(150) NOT NULL DEFAULT 'Barangay Admin',
        message TEXT NOT NULL,
        created_at VARCHAR(64) NOT NULL,
        sort_ts BIGINT NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        KEY idx_reply_msg (message_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.execute(
      `INSERT IGNORE INTO admin_users (
        id, first_name, last_name, full_name, email, contact_no, address, purok, password, avatar_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        DEFAULT_ADMIN_USER.id,
        DEFAULT_ADMIN_USER.firstName,
        DEFAULT_ADMIN_USER.lastName,
        DEFAULT_ADMIN_USER.fullName,
        DEFAULT_ADMIN_USER.email,
        DEFAULT_ADMIN_USER.contactNo,
        DEFAULT_ADMIN_USER.address,
        DEFAULT_ADMIN_USER.purok,
        DEFAULT_ADMIN_USER.password || 'admin123',
        DEFAULT_ADMIN_USER.avatarUrl,
      ]
    );

    // Migrate legacy default user profile avatars to the unified profile icon
    const legacyCondition = (col: string) =>
      `${col} IS NULL OR ${col} = '' OR ${col} LIKE '%/assets/aistudio/%' OR ${col} LIKE '%image_42a9f4ee%' OR ${col} LIKE '%filipino_male_resident%' OR ${col} LIKE '%filipino_female_resident%' OR ${col} LIKE '%barangay_seal%' OR ${col} LIKE '%unsplash.com%' OR ${col} LIKE '%pravatar%' OR ${col} LIKE '%ui-avatars%' OR ${col} LIKE '%dicebear%' OR ${col} LIKE '%randomuser%' OR ${col} LIKE '%4bafadd7-9cc1-4a66-84be-729df7b21bfa%'`;

    await pool.execute(
      `UPDATE admin_users SET avatar_url = ? WHERE ${legacyCondition('avatar_url')}`,
      [DEFAULT_USER_AVATAR]
    );
    await pool.execute(
      `UPDATE residents SET avatar_url = ? WHERE ${legacyCondition('avatar_url')}`,
      [DEFAULT_USER_AVATAR]
    );
    await pool.execute(
      `UPDATE document_requests SET profile_url = ? WHERE ${legacyCondition('profile_url')}`,
      [DEFAULT_USER_AVATAR]
    );
    await pool.execute(
      `UPDATE announcements SET author_avatar = ? WHERE ${legacyCondition('author_avatar')}`,
      [DEFAULT_USER_AVATAR]
    );
    await pool.execute(
      `UPDATE announcement_comments SET author_avatar = ? WHERE ${legacyCondition('author_avatar')}`,
      [DEFAULT_USER_AVATAR]
    );
    await pool.execute(
      `UPDATE resident_messages SET resident_avatar = ? WHERE ${legacyCondition('resident_avatar')}`,
      [DEFAULT_USER_AVATAR]
    );
  }

  private mapResidentRow(row: RowDataPacket): Resident {
    return {
      id: String(row.id),
      firstName: String(row.first_name || ''),
      lastName: String(row.last_name || ''),
      fullName: String(row.full_name || ''),
      email: String(row.email || ''),
      contactNo: String(row.contact_no || ''),
      address: String(row.address || ''),
      purok: String(row.purok || 'Purok 1'),
      street: row.street ? String(row.street) : '',
      houseNo: row.house_no ? String(row.house_no) : '',
      civilStatus: normalizeCivilStatus(row.civil_status),
      isRegisteredVoter: Boolean(row.is_registered_voter),
      role: row.role === 'admin' ? 'admin' : 'resident',
      status: normalizeResidentStatus(row.status),
      requestDate: String(row.request_date || ''),
      avatarUrl: normalizeUserAvatar(row.avatar_url),
      password: row.password ? String(row.password) : 'password123',
      temporaryPassword: row.temporary_password ? String(row.temporary_password) : undefined,
    };
  }

  private mapDocumentRow(row: RowDataPacket): DocumentRequestItem {
    return {
      id: String(row.id),
      residentId: String(row.resident_id),
      fullName: String(row.full_name),
      profileUrl: normalizeUserAvatar(row.profile_url),
      contactNo: String(row.contact_no || ''),
      address: String(row.address || ''),
      documentType: String(row.document_type),
      status: normalizeDocStatus(row.status),
      isArchived: Boolean(row.is_archived),
      purpose: String(row.purpose || ''),
      dateRequested: String(row.date_requested || ''),
      pickupPeriod: String(row.pickup_period || ''),
      controlNo: String(row.control_no || ''),
      remarks: row.remarks ? String(row.remarks) : undefined,
    };
  }

  public async getStats(): Promise<StatsOverview> {
    const residents = await this.getResidents();
    const documents = await this.getDocuments();
    const messages = await this.getMessages();

    return {
      totalPopulation: residents.filter((r) => r.status === 'Approved').length,
      pendingApprovals: residents.filter((r) => r.status === 'Pending').length,
      pendingDocuments: documents.filter((d) => !d.isArchived && d.status === 'Pending').length,
      totalDocuments: documents.filter((d) => !d.isArchived).length,
      totalMessages: messages.length,
      registeredVoters: residents.filter((r) => r.status === 'Approved' && r.isRegisteredVoter).length,
    };
  }

  public async getAdminUser(): Promise<Resident> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        const [rows] = await pool.query<RowDataPacket[]>(
          `SELECT * FROM admin_users WHERE id = 'admin-1' LIMIT 1`
        );
        if (rows.length > 0) {
          const r = rows[0];
          return {
            id: String(r.id),
            firstName: String(r.first_name),
            lastName: String(r.last_name),
            fullName: String(r.full_name),
            email: String(r.email || DEFAULT_ADMIN_USER.email),
            contactNo: String(r.contact_no || DEFAULT_ADMIN_USER.contactNo),
            address: String(r.address || DEFAULT_ADMIN_USER.address),
            purok: String(r.purok || 'Purok 1'),
            civilStatus: 'Married',
            isRegisteredVoter: true,
            role: 'admin',
            status: 'Approved',
            requestDate: '01/01/2026',
            avatarUrl: normalizeUserAvatar(r.avatar_url),
            password: String(r.password || 'admin123'),
          };
        }
      } catch (err) {
        this.handleMysqlError(err);
      }
    }
    return {
      ...this.fallbackDb.adminUser,
      avatarUrl: normalizeUserAvatar(this.fallbackDb.adminUser.avatarUrl),
    };
  }

  public async updateAdminUser(updates: Partial<Resident>): Promise<Resident> {
    const current = await this.getAdminUser();
    const updated: Resident = {
      ...current,
      ...updates,
      id: 'admin-1',
      role: 'admin',
      status: 'Approved',
    };

    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.execute(
          `UPDATE admin_users SET
            first_name = ?,
            last_name = ?,
            full_name = ?,
            email = ?,
            contact_no = ?,
            address = ?,
            purok = ?,
            avatar_url = ?,
            password = ?
           WHERE id = 'admin-1'`,
          [
            updated.firstName,
            updated.lastName,
            updated.fullName,
            updated.email,
            updated.contactNo,
            updated.address,
            updated.purok,
            updated.avatarUrl,
            updated.password || 'admin123',
          ]
        );
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    this.fallbackDb.adminUser = updated;
    this.saveFallbackJson(this.fallbackDb);
    return updated;
  }

  public async getResidents(): Promise<Resident[]> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        const [rows] = await pool.query<RowDataPacket[]>(
          `SELECT * FROM residents ORDER BY created_at DESC`
        );
        const list = rows.map((r: RowDataPacket) => this.mapResidentRow(r));
        this.fallbackDb.residents = list;
        return list;
      } catch (err) {
        this.handleMysqlError(err);
      }
    }
    return this.fallbackDb.residents;
  }

  public async insertResident(resident: Resident): Promise<Resident> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.execute(
          `INSERT INTO residents (
            id, first_name, last_name, full_name, email, contact_no,
            address, purok, street, house_no, civil_status, is_registered_voter,
            role, status, request_date, avatar_url, password, temporary_password
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            resident.id,
            resident.firstName,
            resident.lastName,
            resident.fullName,
            resident.email,
            resident.contactNo,
            resident.address,
            resident.purok,
            resident.street || '',
            resident.houseNo || '',
            resident.civilStatus,
            resident.isRegisteredVoter ? 1 : 0,
            resident.role,
            resident.status,
            resident.requestDate,
            resident.avatarUrl,
            resident.password || 'password123',
            resident.temporaryPassword ?? null,
          ]
        );
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    this.fallbackDb.residents.unshift(resident);
    this.saveFallbackJson(this.fallbackDb);
    return resident;
  }

  public async updateResident(id: string, updates: Partial<Resident>): Promise<Resident | null> {
    if (id === 'admin-1' || id.startsWith('admin')) {
      return this.updateAdminUser(updates);
    }

    const list = await this.getResidents();
    const current = list.find((r) => r.id === id);
    if (!current) return null;

    const updated: Resident = {
      ...current,
      ...updates,
      id: current.id,
      fullName:
        updates.fullName ||
        (updates.firstName || updates.lastName
          ? `${updates.firstName ?? current.firstName} ${updates.lastName ?? current.lastName}`.trim()
          : current.fullName),
    };

    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.execute(
          `UPDATE residents SET
            first_name = ?,
            last_name = ?,
            full_name = ?,
            email = ?,
            contact_no = ?,
            address = ?,
            purok = ?,
            street = ?,
            house_no = ?,
            civil_status = ?,
            is_registered_voter = ?,
            status = ?,
            avatar_url = ?,
            password = ?,
            temporary_password = ?
           WHERE id = ?`,
          [
            updated.firstName,
            updated.lastName,
            updated.fullName,
            updated.email,
            updated.contactNo,
            updated.address,
            updated.purok,
            updated.street || '',
            updated.houseNo || '',
            updated.civilStatus,
            updated.isRegisteredVoter ? 1 : 0,
            updated.status,
            updated.avatarUrl,
            updated.password || 'password123',
            updated.temporaryPassword ?? null,
            id,
          ]
        );
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    const fbIdx = this.fallbackDb.residents.findIndex((r) => r.id === id);
    if (fbIdx !== -1) {
      this.fallbackDb.residents[fbIdx] = updated;
      this.saveFallbackJson(this.fallbackDb);
    }
    return updated;
  }

  public async deleteResident(id: string): Promise<boolean> {
    const pool = await this.ensurePool();
    let deletedMysql = false;
    if (pool) {
      try {
        const [res] = await pool.execute<ResultSetHeader>(
          `DELETE FROM residents WHERE id = ?`,
          [id]
        );
        deletedMysql = res.affectedRows > 0;
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    const prevLen = this.fallbackDb.residents.length;
    this.fallbackDb.residents = this.fallbackDb.residents.filter((r) => r.id !== id);
    const deletedFallback = this.fallbackDb.residents.length !== prevLen;
    if (deletedFallback) {
      this.saveFallbackJson(this.fallbackDb);
    }
    return deletedMysql || deletedFallback;
  }

  public async getDocuments(): Promise<DocumentRequestItem[]> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        const [rows] = await pool.query<RowDataPacket[]>(
          `SELECT * FROM document_requests ORDER BY created_at DESC`
        );
        const list = rows.map((d: RowDataPacket) => this.mapDocumentRow(d));
        this.fallbackDb.documentRequests = list;
        return list;
      } catch (err) {
        this.handleMysqlError(err);
      }
    }
    return this.fallbackDb.documentRequests;
  }

  public async insertDocument(doc: DocumentRequestItem): Promise<DocumentRequestItem> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.execute(
          `INSERT INTO document_requests (
            id, resident_id, full_name, profile_url, contact_no, address,
            document_type, status, is_archived, purpose, date_requested,
            pickup_period, control_no, remarks
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            doc.id,
            doc.residentId,
            doc.fullName,
            doc.profileUrl,
            doc.contactNo,
            doc.address,
            doc.documentType,
            doc.status,
            doc.isArchived ? 1 : 0,
            doc.purpose,
            doc.dateRequested,
            doc.pickupPeriod,
            doc.controlNo,
            doc.remarks ?? null,
          ]
        );
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    this.fallbackDb.documentRequests.unshift(doc);
    this.saveFallbackJson(this.fallbackDb);
    return doc;
  }

  public async updateDocument(
    id: string,
    updates: Partial<DocumentRequestItem>
  ): Promise<DocumentRequestItem | null> {
    const list = await this.getDocuments();
    const current = list.find((d) => d.id === id);
    if (!current) return null;

    const updated: DocumentRequestItem = {
      ...current,
      ...updates,
      id: current.id,
    };

    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.execute(
          `UPDATE document_requests SET
            status = ?,
            is_archived = ?,
            remarks = ?
           WHERE id = ?`,
          [updated.status, updated.isArchived ? 1 : 0, updated.remarks ?? null, id]
        );
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    const fbIdx = this.fallbackDb.documentRequests.findIndex((d) => d.id === id);
    if (fbIdx !== -1) {
      this.fallbackDb.documentRequests[fbIdx] = updated;
      this.saveFallbackJson(this.fallbackDb);
    }
    return updated;
  }

  public async deleteDocument(id: string): Promise<boolean> {
    const pool = await this.ensurePool();
    let deletedMysql = false;
    if (pool) {
      try {
        const [res] = await pool.execute<ResultSetHeader>(
          `DELETE FROM document_requests WHERE id = ?`,
          [id]
        );
        deletedMysql = res.affectedRows > 0;
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    const prevLen = this.fallbackDb.documentRequests.length;
    this.fallbackDb.documentRequests = this.fallbackDb.documentRequests.filter((d) => d.id !== id);
    const deletedFallback = this.fallbackDb.documentRequests.length !== prevLen;
    if (deletedFallback) {
      this.saveFallbackJson(this.fallbackDb);
    }
    return deletedMysql || deletedFallback;
  }

  public async getAnnouncements(): Promise<AnnouncementItem[]> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        const [annRows] = await pool.query<RowDataPacket[]>(
          `SELECT * FROM announcements ORDER BY sort_ts DESC`
        );
        const [comRows] = await pool.query<RowDataPacket[]>(
          `SELECT * FROM announcement_comments ORDER BY sort_ts ASC`
        );

        const commentsByAnn = new Map<string, AnnouncementItem['comments']>();
        for (const c of comRows) {
          const annId = String(c.announcement_id);
          const list = commentsByAnn.get(annId) || [];
          list.push({
            id: String(c.id),
            author: String(c.author),
            authorAvatar: normalizeUserAvatar(c.author_avatar),
            content: String(c.content),
            createdAt: String(c.created_at),
          });
          commentsByAnn.set(annId, list);
        }

        const list: AnnouncementItem[] = annRows.map((a: RowDataPacket) => ({
          id: String(a.id),
          title: String(a.title),
          subtitle: a.subtitle ? String(a.subtitle) : '',
          description: String(a.description || ''),
          eventTime: a.event_time ? String(a.event_time) : '',
          imageUrl: a.image_url ? String(a.image_url) : undefined,
          author: String(a.author || 'Barangay Admin'),
          authorAvatar: normalizeUserAvatar(a.author_avatar),
          createdAt: String(a.created_at || ''),
          comments: commentsByAnn.get(String(a.id)) || [],
        }));

        this.fallbackDb.announcements = list;
        return list;
      } catch (err) {
        this.handleMysqlError(err);
      }
    }
    return this.fallbackDb.announcements;
  }

  public async insertAnnouncement(ann: AnnouncementItem): Promise<AnnouncementItem> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.execute(
          `INSERT INTO announcements (
            id, title, subtitle, description, event_time, image_url,
            author, author_avatar, created_at, sort_ts
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ann.id,
            ann.title,
            ann.subtitle || '',
            ann.description,
            ann.eventTime || '',
            ann.imageUrl ?? null,
            ann.author,
            ann.authorAvatar,
            ann.createdAt,
            Date.now(),
          ]
        );
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    this.fallbackDb.announcements.unshift(ann);
    this.saveFallbackJson(this.fallbackDb);
    return ann;
  }

  public async addAnnouncementComment(
    announcementId: string,
    comment: AnnouncementItem['comments'][number]
  ): Promise<AnnouncementItem['comments'][number] | null> {
    const announcements = await this.getAnnouncements();
    const target = announcements.find((a) => a.id === announcementId);
    if (!target) return null;

    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.execute(
          `INSERT INTO announcement_comments (
            id, announcement_id, author, author_avatar, content, created_at, sort_ts
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            comment.id,
            announcementId,
            comment.author,
            comment.authorAvatar,
            comment.content,
            comment.createdAt,
            Date.now(),
          ]
        );
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    const fbAnn = this.fallbackDb.announcements.find((a) => a.id === announcementId);
    if (fbAnn) {
      fbAnn.comments.push(comment);
      this.saveFallbackJson(this.fallbackDb);
    }
    return comment;
  }

  public async deleteAnnouncement(id: string): Promise<boolean> {
    const pool = await this.ensurePool();
    let deletedMysql = false;
    if (pool) {
      try {
        await pool.execute(`DELETE FROM announcement_comments WHERE announcement_id = ?`, [id]);
        const [res] = await pool.execute<ResultSetHeader>(
          `DELETE FROM announcements WHERE id = ?`,
          [id]
        );
        deletedMysql = res.affectedRows > 0;
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    const prevLen = this.fallbackDb.announcements.length;
    this.fallbackDb.announcements = this.fallbackDb.announcements.filter((a) => a.id !== id);
    const deletedFallback = this.fallbackDb.announcements.length !== prevLen;
    if (deletedFallback) {
      this.saveFallbackJson(this.fallbackDb);
    }
    return deletedMysql || deletedFallback;
  }

  public async getMessages(): Promise<ResidentMessageItem[]> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        const [msgRows] = await pool.query<RowDataPacket[]>(
          `SELECT * FROM resident_messages ORDER BY sort_ts DESC`
        );
        const [repRows] = await pool.query<RowDataPacket[]>(
          `SELECT * FROM message_replies ORDER BY sort_ts ASC`
        );

        const repliesByMsg = new Map<string, NonNullable<ResidentMessageItem['replies']>>();
        for (const r of repRows) {
          const msgId = String(r.message_id);
          const list = repliesByMsg.get(msgId) || [];
          list.push({
            id: String(r.id),
            sender: String(r.sender),
            message: String(r.message),
            createdAt: String(r.created_at),
          });
          repliesByMsg.set(msgId, list);
        }

        const list: ResidentMessageItem[] = msgRows.map((m: RowDataPacket) => ({
          id: String(m.id),
          residentId: String(m.resident_id),
          residentName: String(m.resident_name),
          residentAvatar: normalizeUserAvatar(m.resident_avatar),
          contactNo: String(m.contact_no || ''),
          message: String(m.message || ''),
          category: String(m.category || 'General Inquiry'),
          status: normalizeMsgStatus(m.status),
          createdAt: String(m.created_at || ''),
          replies: repliesByMsg.get(String(m.id)) || [],
        }));

        this.fallbackDb.residentMessages = list;
        return list;
      } catch (err) {
        this.handleMysqlError(err);
      }
    }
    return this.fallbackDb.residentMessages;
  }

  public async insertMessage(msg: ResidentMessageItem): Promise<ResidentMessageItem> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.execute(
          `INSERT INTO resident_messages (
            id, resident_id, resident_name, resident_avatar, contact_no,
            message, category, status, created_at, sort_ts
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            msg.id,
            msg.residentId,
            msg.residentName,
            msg.residentAvatar,
            msg.contactNo,
            msg.message,
            msg.category,
            msg.status,
            msg.createdAt,
            Date.now(),
          ]
        );
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    this.fallbackDb.residentMessages.unshift(msg);
    this.saveFallbackJson(this.fallbackDb);
    return msg;
  }

  public async addMessageReply(
    messageId: string,
    reply: NonNullable<ResidentMessageItem['replies']>[number]
  ): Promise<NonNullable<ResidentMessageItem['replies']>[number] | null> {
    const messages = await this.getMessages();
    const target = messages.find((m) => m.id === messageId);
    if (!target) return null;

    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.execute(
          `INSERT INTO message_replies (id, message_id, sender, message, created_at, sort_ts)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [reply.id, messageId, reply.sender, reply.message, reply.createdAt, Date.now()]
        );
        await pool.execute(
          `UPDATE resident_messages SET status = 'Under Review' WHERE id = ?`,
          [messageId]
        );
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    const fbMsg = this.fallbackDb.residentMessages.find((m) => m.id === messageId);
    if (fbMsg) {
      if (!fbMsg.replies) fbMsg.replies = [];
      fbMsg.replies.push(reply);
      fbMsg.status = 'Under Review';
      this.saveFallbackJson(this.fallbackDb);
    }
    return reply;
  }

  public async deleteMessage(id: string): Promise<boolean> {
    const pool = await this.ensurePool();
    let deletedMysql = false;
    if (pool) {
      try {
        await pool.execute(`DELETE FROM message_replies WHERE message_id = ?`, [id]);
        const [res] = await pool.execute<ResultSetHeader>(
          `DELETE FROM resident_messages WHERE id = ?`,
          [id]
        );
        deletedMysql = res.affectedRows > 0;
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    const prevLen = this.fallbackDb.residentMessages.length;
    this.fallbackDb.residentMessages = this.fallbackDb.residentMessages.filter((m) => m.id !== id);
    const deletedFallback = this.fallbackDb.residentMessages.length !== prevLen;
    if (deletedFallback) {
      this.saveFallbackJson(this.fallbackDb);
    }
    return deletedMysql || deletedFallback;
  }

  public async resetPopulation(): Promise<void> {
    const pool = await this.ensurePool();
    if (pool) {
      try {
        await pool.query(`DELETE FROM message_replies`);
        await pool.query(`DELETE FROM resident_messages`);
        await pool.query(`DELETE FROM document_requests`);
        await pool.query(`DELETE FROM residents`);
      } catch (err) {
        this.handleMysqlError(err);
      }
    }

    this.fallbackDb.residents = [];
    this.fallbackDb.documentRequests = [];
    this.fallbackDb.residentMessages = [];
    this.saveFallbackJson(this.fallbackDb);
  }
}
