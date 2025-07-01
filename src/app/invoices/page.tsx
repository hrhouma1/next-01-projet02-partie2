import { db } from '@/db';
import { invoices } from '@/db/schema';

export default async function InvoicesPage() {
  const allInvoices = await db.select().from(invoices);
  
  const totalAmount = allInvoices.reduce((sum, invoice) => {
    return sum + parseFloat(invoice.value || '0');
  }, 0);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Liste des factures
          </h1>
          <a
            href="/invoices/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Nouvelle facture
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {allInvoices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-4">Aucune facture trouvée</p>
              <a
                href="/invoices/new"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Créer votre première facture
              </a>
            </div>
          ) : (
            <>
              <div className="p-6 bg-gray-50 border-b">
                <p className="text-lg font-semibold text-gray-700">
                  Total : {totalAmount.toFixed(2)} €
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          #{invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.customer}
                          </div>
                          {invoice.description && (
                            <div className="text-sm text-gray-500">
                              {invoice.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {parseFloat(invoice.value || '0').toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            invoice.status === 'open' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}