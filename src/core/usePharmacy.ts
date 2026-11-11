/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * React Hook for Centralized Pharmacy Data & Calculation Engine
 */

import { useEffect, useState } from 'react';
import { pharmacyStore } from './store';

export function usePharmacy() {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Subscribe to centralized store mutations
    const unsubscribe = pharmacyStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    // Centralized Data Getters
    products: pharmacyStore.getProducts(),
    suppliers: pharmacyStore.getSuppliers(),
    doctors: pharmacyStore.getDoctors(),
    serviceFees: pharmacyStore.getServiceFees(),
    members: pharmacyStore.getMembers(),
    promos: pharmacyStore.getPromos(),
    shifts: pharmacyStore.getAllShifts(),
    currentShift: pharmacyStore.getCurrentShift(),
    sales: pharmacyStore.getSales(),
    purchases: pharmacyStore.getPurchases(),
    cashTransactions: pharmacyStore.getCashTransactions(),
    stockOpnameRecords: pharmacyStore.getStockOpnameRecords(),
    chartOfAccounts: pharmacyStore.getChartOfAccounts(),
    branches: pharmacyStore.getBranches(),
    activeBranch: pharmacyStore.getActiveBranch(),
    rules: pharmacyStore.getRulesConfig(),
    settings: pharmacyStore.getSettings(),
    defectaItems: pharmacyStore.getDefectaProducts(),
    nearExpiryBatches: pharmacyStore.getNearExpiryBatches(),

    // User Authentication & RBAC
    currentUser: pharmacyStore.getCurrentUser(),
    users: pharmacyStore.getUsers(),
    login: pharmacyStore.login.bind(pharmacyStore),
    logout: pharmacyStore.logout.bind(pharmacyStore),
    switchRole: pharmacyStore.switchRole.bind(pharmacyStore),
    addUser: pharmacyStore.addUser.bind(pharmacyStore),
    updateUser: pharmacyStore.updateUser.bind(pharmacyStore),

    // Centralized Actions
    updateSettings: pharmacyStore.updateSettings.bind(pharmacyStore),
    checkoutSale: pharmacyStore.checkoutSale.bind(pharmacyStore),
    openShift: pharmacyStore.openShift.bind(pharmacyStore),
    closeShift: pharmacyStore.closeShift.bind(pharmacyStore),
    addProduct: pharmacyStore.addProduct.bind(pharmacyStore),
    updateProduct: pharmacyStore.updateProduct.bind(pharmacyStore),
    deleteProduct: pharmacyStore.deleteProduct.bind(pharmacyStore),
    addSupplier: pharmacyStore.addSupplier.bind(pharmacyStore),
    addDoctor: pharmacyStore.addDoctor.bind(pharmacyStore),
    updateServiceFee: pharmacyStore.updateServiceFee.bind(pharmacyStore),
    addMember: pharmacyStore.addMember.bind(pharmacyStore),
    addPurchaseInvoice: pharmacyStore.addPurchaseInvoice.bind(pharmacyStore),
    addCashTransaction: pharmacyStore.addCashTransaction.bind(pharmacyStore),
    addStockOpname: pharmacyStore.addStockOpname.bind(pharmacyStore),
    setActiveBranch: pharmacyStore.setActiveBranch.bind(pharmacyStore),
    updateRulesConfig: pharmacyStore.updateRulesConfig.bind(pharmacyStore),
    resetRulesToDefault: pharmacyStore.resetRulesToDefault.bind(pharmacyStore),
  };
}
