export interface Encuesta {
  id?: number;
  user_id: string;
  user_email: string;
  nombre_apellido: string;
  edad: number;
  telefono: string;
  juego_favorito: string;         
  recomienda_plataforma: boolean;      
  nivel_satisfaccion: number;              
  sugerencias: string;                    
  created_at?: string;
}