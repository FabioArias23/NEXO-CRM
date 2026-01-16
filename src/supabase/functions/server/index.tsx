import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Auth Routes
app.post('/make-server-1db75c60/auth/signup', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: role || 'employee' },
      email_confirm: true, // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup exception: ${error}`);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

app.post('/make-server-1db75c60/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Signin error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    console.log(`Signin exception: ${error}`);
    return c.json({ error: 'Signin failed' }, 500);
  }
});

// Opportunity Routes
app.get('/make-server-1db75c60/opportunities', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const opportunities = await kv.getByPrefix('opportunity:');
    return c.json({ opportunities });
  } catch (error) {
    console.log(`Error fetching opportunities: ${error}`);
    return c.json({ error: 'Failed to fetch opportunities' }, 500);
  }
});

app.post('/make-server-1db75c60/opportunities', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const opportunity = {
      id,
      ...body,
      ownerId: user.id,
      ownerEmail: user.email,
      ownerName: user.user_metadata?.name || user.email,
      lastModifiedBy: user.id,
      lastModifiedByEmail: user.email,
      lastModifiedByName: user.user_metadata?.name || user.email,
      createdAt: now,
      updatedAt: now,
    };

    await kv.set(`opportunity:${id}`, opportunity);
    
    // Log activity
    await kv.set(`activity:${crypto.randomUUID()}`, {
      id: crypto.randomUUID(),
      userId: user.id,
      userEmail: user.email,
      userName: user.user_metadata?.name || user.email,
      action: 'create',
      entityType: 'opportunity',
      entityId: id,
      entityName: body.name,
      timestamp: now,
      details: { stage: body.stage, value: body.value }
    });
    
    return c.json({ opportunity });
  } catch (error) {
    console.log(`Error creating opportunity: ${error}`);
    return c.json({ error: 'Failed to create opportunity' }, 500);
  }
});

app.put('/make-server-1db75c60/opportunities/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`opportunity:${id}`);

    if (!existing) {
      return c.json({ error: 'Opportunity not found' }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      id, // Preserve ID
      ownerId: existing.ownerId, // Preserve owner
      ownerEmail: existing.ownerEmail,
      ownerName: existing.ownerName,
      createdAt: existing.createdAt, // Preserve creation date
      lastModifiedBy: user.id,
      lastModifiedByEmail: user.email,
      lastModifiedByName: user.user_metadata?.name || user.email,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`opportunity:${id}`, updated);
    
    // Log activity
    const changes = [];
    if (existing.stage !== body.stage) changes.push(`stage: ${existing.stage} → ${body.stage}`);
    if (existing.value !== body.value) changes.push(`value: $${existing.value} → $${body.value}`);
    if (existing.probability !== body.probability) changes.push(`probability: ${existing.probability}% → ${body.probability}%`);
    
    await kv.set(`activity:${crypto.randomUUID()}`, {
      id: crypto.randomUUID(),
      userId: user.id,
      userEmail: user.email,
      userName: user.user_metadata?.name || user.email,
      action: 'update',
      entityType: 'opportunity',
      entityId: id,
      entityName: body.name || existing.name,
      timestamp: new Date().toISOString(),
      details: { changes }
    });
    
    return c.json({ opportunity: updated });
  } catch (error) {
    console.log(`Error updating opportunity: ${error}`);
    return c.json({ error: 'Failed to update opportunity' }, 500);
  }
});

app.delete('/make-server-1db75c60/opportunities/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const existing = await kv.get(`opportunity:${id}`);
    
    await kv.del(`opportunity:${id}`);
    
    // Log activity
    await kv.set(`activity:${crypto.randomUUID()}`, {
      id: crypto.randomUUID(),
      userId: user.id,
      userEmail: user.email,
      userName: user.user_metadata?.name || user.email,
      action: 'delete',
      entityType: 'opportunity',
      entityId: id,
      entityName: existing?.name || 'Unknown',
      timestamp: new Date().toISOString(),
      details: {}
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting opportunity: ${error}`);
    return c.json({ error: 'Failed to delete opportunity' }, 500);
  }
});

// Admin Routes
app.get('/make-server-1db75c60/admin/activities', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const activities = await kv.getByPrefix('activity:');
    return c.json({ activities: activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ) });
  } catch (error) {
    console.log(`Error fetching activities: ${error}`);
    return c.json({ error: 'Failed to fetch activities' }, 500);
  }
});

app.get('/make-server-1db75c60/admin/users', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      return c.json({ error: usersError.message }, 500);
    }

    return c.json({ users });
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

app.get('/make-server-1db75c60/admin/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    const opportunities = await kv.getByPrefix('opportunity:');
    const activities = await kv.getByPrefix('activity:');
    const { data: { users } } = await supabase.auth.admin.listUsers();

    // Calculate stats per user
    const userStats = users?.map(u => {
      const userOpps = opportunities.filter(opp => opp.ownerId === u.id);
      const userActivities = activities.filter(act => act.userId === u.id);
      const totalValue = userOpps.reduce((sum, opp) => sum + opp.value, 0);
      const wonDeals = userOpps.filter(opp => opp.stage === 'Cerrado Ganado').length;
      
      return {
        userId: u.id,
        email: u.email,
        name: u.user_metadata?.name || u.email,
        role: u.user_metadata?.role || 'employee',
        opportunitiesCount: userOpps.length,
        activitiesCount: userActivities.length,
        totalValue,
        wonDeals,
        lastActive: userActivities[0]?.timestamp || u.created_at
      };
    }) || [];

    return c.json({ stats: userStats });
  } catch (error) {
    console.log(`Error fetching stats: ${error}`);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

Deno.serve(app.fetch);