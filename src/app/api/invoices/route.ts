import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    console.log('API POST /api/invoices - Début de la requête');
    
    const body = await request.json();
    console.log('Body reçu:', JSON.stringify(body, null, 2));
    
    const { customer, email, value, description } = body;

    // Validation basique
    if (!customer || !email || !value) {
      console.log('Validation échouée - champs manquants');
      return NextResponse.json(
        { error: 'Les champs customer, email et value sont requis' },
        { status: 400 }
      );
    }

    console.log('Validation réussie');
    
    // Obtenir le prochain ID disponible
    console.log('Recherche du prochain ID disponible...');
    const maxIdResult = await db.execute(sql`SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM invoices`);
    const nextAvailableId = maxIdResult.rows[0]?.next_id || 1;
    console.log('Prochain ID disponible:', nextAvailableId);
    
    const insertData = {
      id: Number(nextAvailableId),
      customer,
      email,
      value: value.toString(),
      description: description || null,
      status: 'open' as const
    };
    
    console.log('Données à insérer:', insertData);
    console.log('Tentative d\'insertion en base...');
    
    const result = await db.insert(invoices).values(insertData).returning();
    
    console.log('Insertion réussie:', result);
    
    return NextResponse.json({ 
      success: true, 
      invoice: result[0],
      message: 'Facture créée avec succès'
    });
    
  } catch (error) {
    console.error('Erreur dans POST /api/invoices:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la facture' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('API GET /api/invoices - Récupération des factures');
    
    const allInvoices = await db.select().from(invoices);
    
    console.log('Factures récupérées:', allInvoices.length);
    
    return NextResponse.json({
      success: true,
      invoices: allInvoices
    });
    
  } catch (error) {
    console.error('Erreur dans GET /api/invoices:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}