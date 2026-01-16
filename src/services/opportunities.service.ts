// LÓGICA DE NEGOCIO
// Validaciones, transformaciones, reglas de negocio
// Usa queries

import { opportunitiesQueries } from "../client/queries/opportunities.queries";
import { Opportunity, OpportunityRow, ApiError } from "../core/types";

export const opportunitiesService = {
  /**
   * Obtener todas las oportunidades del usuario
   * Para admins, usar getAllForAdmin()
   */
  async getAll(userId: string): Promise<Opportunity[]> {
    try {
      return await opportunitiesQueries.getAll(userId);
    } catch (error: any) {
      throw this._handleError(error);
    }
  },

  /**
   * Obtener todas las oportunidades (ADMIN)
   */
  async getAllForAdmin(): Promise<Opportunity[]> {
    try {
      return await opportunitiesQueries.getAllForAdmin();
    } catch (error: any) {
      throw this._handleError(error);
    }
  },

  async getById(id: string): Promise<Opportunity> {
    try {
      return await opportunitiesQueries.getById(id);
    } catch (error: any) {
      throw this._handleError(error);
    }
  },

  /**
   * Crear nueva oportunidad
   * NOTA: Ya NO necesitamos pasar nombre/email del owner
   * porque se obtienen automáticamente con JOIN
   */
  async create(
    userId: string,
    data: Omit<
      OpportunityRow,
      "id" | "created_at" | "updated_at" | "owner_id" | "last_modified_by"
    >,
  ): Promise<Opportunity> {
    try {
      this._validateOpportunity(data);

      const opp = await opportunitiesQueries.create({
        ...data,
        owner_id: userId,
        last_modified_by: userId,
      });

      return opp;
    } catch (error: any) {
      throw this._handleError(error);
    }
  },

  /**
   * Actualizar oportunidad existente
   */
  async update(
    id: string,
    userId: string,
    updates: Partial<OpportunityRow>,
  ): Promise<Opportunity> {
    try {
      if (Object.keys(updates).length === 0) {
        throw new Error("No hay cambios que guardar");
      }

      if (updates.name || updates.value || updates.probability) {
        this._validateOpportunity(updates as any);
      }

      return await opportunitiesQueries.update(id, {
        ...updates,
        last_modified_by: userId,
      });
    } catch (error: any) {
      throw this._handleError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await opportunitiesQueries.delete(id);
    } catch (error: any) {
      throw this._handleError(error);
    }
  },

  onChanges(userId: string, callback: (opp: Opportunity) => void) {
    return opportunitiesQueries.onChanges(userId, callback);
  },

  // ✅ LÓGICA DE NEGOCIO
  _validateOpportunity(data: Partial<OpportunityRow>) {
    if (data.name !== undefined && (!data.name || data.name.length < 3)) {
      throw new Error("Nombre debe tener ≥ 3 caracteres");
    }
    if (data.value !== undefined && data.value <= 0) {
      throw new Error("Valor debe ser > 0");
    }
    if (
      data.probability !== undefined &&
      (data.probability < 0 || data.probability > 100)
    ) {
      throw new Error("Probabilidad entre 0-100");
    }
  },

  _handleError(error: any): ApiError {
    return {
      code: error.code || "OPP_ERROR",
      message: error.message || "Error con oportunidades",
      details: error,
    };
  },
};
