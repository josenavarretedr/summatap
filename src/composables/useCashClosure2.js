import { getFirestore, collection, setDoc, doc, getDocs, query, where, serverTimestamp, getDoc } from 'firebase/firestore';
import appFirebase from '@/firebaseInit';

const db = getFirestore(appFirebase);

export function useCashClosure() {
  const createCashClosure = async (cashClosureData, businessId = 'ferrercard') => {
    try {
      const cashClosureRef = doc(collection(db, `businesses/${businessId}/cashClosures`)); // Firestore genera el ID automáticamente
      await setDoc(cashClosureRef, {
        ...cashClosureData,
        createdAt: serverTimestamp(),
      });
      console.log('Cash closure record created in Firestore');
    } catch (error) {
      console.error('Error creating cash closure record: ', error);
      throw error;
    }
  };

  const getCashClosureById = async (cashClosureId, businessId = 'ferrercard') => {
    try {
      const cashClosureRef = doc(db, `businesses/${businessId}/cashClosures`, cashClosureId);
      const cashClosureSnap = await getDoc(cashClosureRef);
      if (cashClosureSnap.exists()) {
        return {
          id: cashClosureSnap.id,
          ...cashClosureSnap.data()
        };
      } else {
        console.log("No such cash closure!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching cash closure by ID: ", error);
      throw error;
    }
  };

  const getCashClosuresForBusiness = async (businessId = 'ferrercard') => {
    try {
      const cashClosuresSnapshot = await getDocs(collection(db, `businesses/${businessId}/cashClosures`));
      const cashClosures = [];
      cashClosuresSnapshot.forEach(doc => {
        cashClosures.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return cashClosures;
    } catch (error) {
      console.error('Error fetching cash closures for business: ', error);
      throw error;
    }
  };

  // Puedes agregar más funciones aquí si necesitas funcionalidades adicionales para cashClosures en Firestore
  // como obtener cierres por rango de fechas, usuario, etc.

  return {
    createCashClosure,
    getCashClosureById,
    getCashClosuresForBusiness,
  };
}