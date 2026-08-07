/**
 * Google Cloud / Firebase Simulador - Conector Real-time
 * Este módulo emula a funcionalidade do Firestore e Google Cloud Run.
 * Persiste dados localmente no LocalStorage e expõe listeners de sincronização.
 */

export interface FirebaseTransaction {
  id: string;
  type: "in" | "out";
  title: string;
  category: string;
  amount: number;
  date: string;
  timestamp: number;
}

const STORAGE_KEY = "gbank_infinite_firestore_transactions";

const DEFAULT_TRANSACTIONS: FirebaseTransaction[] = [
  { id: "1", type: "in", title: "Depósito Recebido", category: "Pix Recebido", amount: 2500.00, date: "Hoje, 10:42", timestamp: Date.now() - 3600000 * 2 },
  { id: "2", type: "out", title: "Supermercado Cyber", category: "Alimentação", amount: 142.30, date: "Hoje, 08:15", timestamp: Date.now() - 3600000 * 4 },
  { id: "3", type: "out", title: "Assinatura Antigravity", category: "Tecnologia", amount: 49.90, date: "Ontem, 22:10", timestamp: Date.now() - 3600000 * 12 },
  { id: "4", type: "in", title: "Rendimento CDB", category: "Investimentos", amount: 12.80, date: "17 de Mai, 18:00", timestamp: Date.now() - 3600000 * 24 },
  { id: "5", type: "out", title: "Posto de Combustível", category: "Transporte", amount: 220.00, date: "16 de Mai, 14:30", timestamp: Date.now() - 3600000 * 36 },
];

export class FirebaseConnector {
  /**
   * Obtém todas as transações persistidas no "Firestore" (LocalStorage)
   */
  static getTransactions(): FirebaseTransaction[] {
    if (typeof window === "undefined") return DEFAULT_TRANSACTIONS;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
      return DEFAULT_TRANSACTIONS;
    }
    return JSON.parse(stored);
  }

  /**
   * Adiciona um novo documento ao "Firestore" e simula a latência do Google Cloud Run
   */
  static async addTransaction(tx: Omit<FirebaseTransaction, "id" | "timestamp">): Promise<{ success: boolean; latency: number; log: string }> {
    return new Promise((resolve) => {
      const latency = Math.floor(Math.random() * 25) + 12; // 12-37ms latency
      
      setTimeout(() => {
        const transactions = this.getTransactions();
        const newDoc: FirebaseTransaction = {
          ...tx,
          id: `gfirestore_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now()
        };

        const updated = [newDoc, ...transactions];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Trigger custom storage event for live updates across components
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("firestore_update"));
        }

        resolve({
          success: true,
          latency,
          log: `[Google Cloud] POST https://gcp-run-pix-connector.a47.run/v1/transfer - status: 200 OK | Firestore Doc: transactions/${newDoc.id} created successfully.`
        });
      }, latency);
    });
  }

  /**
   * Reseta o banco de dados simulado
   */
  static resetDatabase() {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TRANSACTIONS));
    window.dispatchEvent(new Event("firestore_update"));
  }
}
