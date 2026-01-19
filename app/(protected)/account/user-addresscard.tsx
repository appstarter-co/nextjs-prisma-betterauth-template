"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import axios from "axios";

interface Address {
  id: string;
  userId: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserAddressCard() {
  const { data: session } = authClient.useSession();
  const { isOpen, openModal, closeModal } = useModal();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Address | null>(null);

  // Delete handling
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form state
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const resetForm = useCallback((a?: Address | null) => {
    const addr = a ?? null;
    setLine1(addr?.line1 || "");
    setLine2(addr?.line2 || "");
    setCity(addr?.city || "");
    setStateVal(addr?.state || "");
    setPostalCode(addr?.postalCode || "");
    setCountry(addr?.country || "");
  }, []);

  const loadAddresses = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    setError(null);
    try {
      /*if server.js in server-example is running, 
      you can use this endpoint to test with JWT auth:
      http://localhost:3001/api/user/address */

      const res = await axios.get(`/api/user/address`, { params: { ts: Date.now() } }); // CHANGED
      setAddresses(res.data as Address[]);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleNew = () => {
    setEditing(null);
    resetForm(null);
    openModal();
  };

  const handleEdit = (a: Address) => {
    setEditing(a);
    resetForm(a);
    openModal();
  };

  const handleSave = async () => {
    if (!line1 || !city || !country) {
      setError("Line1, City, Country are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        const res = await fetch(`/api/user/address/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            line1,
            line2: line2 || null,
            city,
            state: stateVal || null,
            postalCode: postalCode || null,
            country,
          }),
        });
        if (!res.ok) throw new Error("Failed to update address");
      } else {
        const res = await fetch(`/api/user/address`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            line1,
            line2: line2 || null,
            city,
            state: stateVal || null,
            postalCode: postalCode || null,
            country,
          }),
        });
        if (!res.ok) throw new Error("Failed to create address");
      }
      await loadAddresses();
      closeModal();
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/address/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete address");
      setAddresses(prev => prev.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e: any) {
      setError(e.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!session?.user) return null;

  return (
    <>
      <Card className="@container/card">
        <div className="pl-5 pr-5 py-5 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Addresses</h4>
            <Button variant="outline" size="sm" onClick={handleNew} className="gap-2">
              <Plus className="size-4" />
              {addresses.length === 0 ? "Add Address" : "New"}
            </Button>
          </div>

          {loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading addresses...</p>
          )}

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            {!loading && addresses.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No addresses yet. Click &quot;Add Address&quot; to create one.
              </p>
            )}

            {addresses.length > 0 && (
              <div className="space-y-5">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className="relative border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/40"
                  >
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleEdit(a)}
                        className="bg-white dark:bg-gray-700 shadow-sm"
                        title="Edit address"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setDeleteTarget(a)}
                        className="shadow-sm"
                        title="Delete address"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-3">
                      <div className="flex-1 min-w-[180px]">
                        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Line 1</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {a.line1}
                        </p>
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">City / State</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {a.city}{a.state ? `, ${a.state}` : ""}
                        </p>
                      </div>
                    </div>

                    {a.line2 && (
                      <div className="mb-3">
                        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Line 2</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {a.line2}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Country / Postal</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {a.country}{a.postalCode ? `, ${a.postalCode}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-10">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {editing ? "Edit Address" : "New Address"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {editing ? "Update address details." : "Add a new address to your profile."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <Label>Line 1 *</Label>
                <Input value={line1} onChange={(e) => setLine1(e.target.value)} required />
              </div>
              <div className="lg:col-span-2">
                <Label>Line 2</Label>
                <Input value={line2} onChange={(e) => setLine2(e.target.value)} />
              </div>
              <div>
                <Label>City *</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div>
                <Label>State</Label>
                <Input value={stateVal} onChange={(e) => setStateVal(e.target.value)} />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
              <div>
                <Label>Country *</Label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex items-center gap-3 justify-end pt-4">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  closeModal();
                  setError(null);
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => (!deleteLoading ? setDeleteTarget(null) : null)}
        className="max-w-sm m-4"
      >
        <div className="p-5">
          <h4 className="text-lg font-semibold mb-2">Delete Address</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete this address?
          </p>
          <div className="space-y-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <p><span className="font-medium">Line 1:</span> {deleteTarget?.line1}</p>
            {deleteTarget?.line2 && (
              <p><span className="font-medium">Line 2:</span> {deleteTarget.line2}</p>
            )}
            <p>
              <span className="font-medium">City/State:</span>{" "}
              {deleteTarget?.city}{deleteTarget?.state ? `, ${deleteTarget.state}` : ""}
            </p>
            <p>
              <span className="font-medium">Country/Postal:</span>{" "}
              {deleteTarget?.country}{deleteTarget?.postalCode ? `, ${deleteTarget.postalCode}` : ""}
            </p>
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-3">{error}</p>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}