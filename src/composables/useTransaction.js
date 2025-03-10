import { getFirestore, collection, setDoc, doc, updateDoc, serverTimestamp, getDocs, getDoc, query, where, deleteDoc } from 'firebase/firestore';
import appFirebase from '@/firebaseInit';

const db = getFirestore(appFirebase);

export function useTransaccion() {
  const createTransaction = async (transaction, businessId = 'ferrercard') => {
    try {
      const transactionRef = doc(db, `businesses/${businessId}/transactions`, transaction.uuid)
      await setDoc(transactionRef, {
        ...transaction,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating transaction: ', error);
      throw error;
    }
  };

  const updateTransaction = async (transactionId, updatedData) => {
    try {
      const transactionRef = doc(db, 'businesses', updatedData.businessId, 'transactions', transactionId);
      await updateDoc(transactionRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating transaction: ', error);
      throw error;
    }
  };

  const getAllTransactions = async (businessId = 'ferrercard') => {
    try {
      const transactionsSnapshot = await getDocs(collection(db, 'businesses', businessId, 'transactions'));

      const transactions = [];

      transactionsSnapshot.forEach(doc => {
        transactions.push({
          id: doc.id,
          ...doc.data(),
        });

        console.log(doc.id, " => ", doc.data());
      });

      return transactions
    } catch (error) {
      console.error('Error fetching transactions: ', error);
      throw error;
    }
  };

  const getTransactionsTodayCmps = async (businessId = 'ferrercard') => {

    let transactions = [];
    // Obtén el inicio del día actual (00:00:00)
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Obtén el final del día actual (23:59:59)
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const q = query(
      collection(db, `businesses/${businessId}/transactions`),
      where("createdAt", ">=", startOfDay),
      where("createdAt", "<", endOfDay)
    );

    // Ejecuta la consulta y almacena los resultados en `dailyData`
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data());
    });

    return transactions;
  };

  const deleteTransactionByID = async (transactionID, businessId = 'ferrercard') => {
    try {
      const transactionRef = doc(db, `businesses/${businessId}/transactions`, transactionID);
      await deleteDoc(transactionRef);
    }
    catch (error) {
      console.error('Error fetching transactions: ', error);
      throw error;
    }

  }

  return {
    createTransaction,
    updateTransaction,
    deleteTransactionByID,
    getTransactionsTodayCmps,
    getAllTransactions,
  };
}