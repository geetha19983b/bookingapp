import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  fetchUnits,
  createUnit,
  updateUnit,
  deleteUnit,
  clearError,
  clearSuccessMessage,
} from '../store/unitSlice';
import type { Unit } from '../types/unit.types';
import { Button } from '../../../components/ui';
import styles from './UnitsConfigModal.module.scss';

interface UnitsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditingUnit {
  id: number | null;
  code: string;
  name: string;
}

export default function UnitsConfigModal({ isOpen, onClose }: UnitsConfigModalProps) {
  const dispatch = useAppDispatch();
  const { units, loading, error } = useAppSelector((state) => state.units);

  const [editingUnit, setEditingUnit] = useState<EditingUnit | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newUnit, setNewUnit] = useState({ code: '', name: '' });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUnits());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleEdit = (unit: Unit) => {
    setEditingUnit({
      id: unit.id,
      code: unit.code,
      name: unit.name,
    });
    setIsAddingNew(false);
  };

  const handleSaveEdit = async () => {
    if (!editingUnit || editingUnit.id === null) return;

    if (!editingUnit.code.trim() || !editingUnit.name.trim()) {
      return;
    }

    try {
      await dispatch(
        updateUnit({
          id: editingUnit.id,
          payload: {
            code: editingUnit.code.trim().toUpperCase(),
            name: editingUnit.name.trim(),
          },
        })
      ).unwrap();
      setEditingUnit(null);
    } catch (err) {
      // Error handled by Redux
    }
  };

  const handleCancelEdit = () => {
    setEditingUnit(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await dispatch(deleteUnit(id)).unwrap();
      } catch (err) {
        // Error handled by Redux
      }
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewUnit({ code: '', name: '' });
    setEditingUnit(null);
  };

  const handleSaveNew = async () => {
    if (!newUnit.code.trim() || !newUnit.name.trim()) {
      return;
    }

    try {
      await dispatch(
        createUnit({
          code: newUnit.code.trim().toUpperCase(),
          name: newUnit.name.trim(),
          createdBy: 'system',
        })
      ).unwrap();
      setIsAddingNew(false);
      setNewUnit({ code: '', name: '' });
    } catch (err) {
      // Error handled by Redux
    }
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewUnit({ code: '', name: '' });
  };

  const handleClose = () => {
    setEditingUnit(null);
    setIsAddingNew(false);
    setNewUnit({ code: '', name: '' });
    dispatch(clearError());
    dispatch(clearSuccessMessage());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.unitsConfigModal} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Configure Units</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {units.length === 0 && !isAddingNew ? (
            <div className={styles.emptyState}>
              <p>No units configured yet. Click "Add New" to create one.</p>
            </div>
          ) : (
            <div className={styles.unitsList}>
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className={`${styles.unitRow} ${editingUnit?.id === unit.id ? styles.editing : ''}`}
                >
                  {editingUnit?.id === unit.id ? (
                    <>
                      <input
                        type="text"
                        value={editingUnit.code}
                        onChange={(e) =>
                          setEditingUnit({ ...editingUnit, code: e.target.value.toUpperCase() })
                        }
                        placeholder="Unit Code"
                        className={styles.unitInput}
                        maxLength={10}
                      />
                      <input
                        type="text"
                        value={editingUnit.name}
                        onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                        placeholder="Unit Name"
                        className={styles.unitInput}
                        maxLength={100}
                      />
                      <div className={styles.actions}>
                        <button
                          className={`${styles.iconButton} ${styles.save}`}
                          onClick={handleSaveEdit}
                          title="Save"
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          className={styles.iconButton}
                          onClick={handleCancelEdit}
                          title="Cancel"
                        >
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className={styles.unitCode}>{unit.code}</span>
                      <span className={styles.unitName}>{unit.name}</span>
                      <div className={styles.actions}>
                        <button
                          className={styles.iconButton}
                          onClick={() => handleEdit(unit)}
                          title="Edit"
                        >
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          className={`${styles.iconButton} ${styles.delete}`}
                          onClick={() => handleDelete(unit.id)}
                          title="Delete"
                        >
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Add New Row */}
              {isAddingNew && (
                <div className={`${styles.unitRow} ${styles.editing}`}>
                  <input
                    type="text"
                    value={newUnit.code}
                    onChange={(e) => setNewUnit({ ...newUnit, code: e.target.value.toUpperCase() })}
                    placeholder="Unit Code (e.g., KG)"
                    className={styles.unitInput}
                    maxLength={10}
                  />
                  <input
                    type="text"
                    value={newUnit.name}
                    onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                    placeholder="Unit Name (e.g., Kilogram)"
                    className={styles.unitInput}
                    maxLength={100}
                  />
                  <div className={styles.actions}>
                    <button
                      className={`${styles.iconButton} ${styles.save}`}
                      onClick={handleSaveNew}
                      title="Save"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={handleCancelNew}
                      title="Cancel"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add New Button */}
          {!isAddingNew && (
            <button className={styles.addNewButton} onClick={handleAddNew} disabled={loading}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Unit
            </button>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
