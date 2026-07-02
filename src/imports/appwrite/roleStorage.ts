export const setPendingRole = (role: string) => {
  try {
    localStorage.setItem('pendingRole', role);
  } catch (e) {
    console.warn('Unable to set pending role', e);
  }
};

export const getPendingRole = (): string | null => {
  try {
    return localStorage.getItem('pendingRole');
  } catch (e) {
    console.warn('Unable to get pending role', e);
    return null;
  }
};

export const clearPendingRole = () => {
  try {
    localStorage.removeItem('pendingRole');
  } catch (e) {
    console.warn('Unable to clear pending role', e);
  }
};
