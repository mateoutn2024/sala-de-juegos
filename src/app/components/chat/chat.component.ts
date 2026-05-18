import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../services/auth.service';

interface Mensaje {
  id?: number;
  usuario: string;
  texto: string;
  fecha_hora: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private contenedorScroll!: ElementRef;
  
  private supabase: SupabaseClient;
  private chatChannel!: RealtimeChannel;
  
  mensajes: Mensaje[] = [];
  nuevoMensaje: string = '';
  usuarioActual: string = '';

  constructor(private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async ngOnInit() {
    await this.obtenerUsuarioActual();
    await this.cargarHistorial();
    this.conectarCanalRealtime();
  }
  
  private async obtenerUsuarioActual() {
    const usuario = await this.authService.getUsuarioActual();
    this.usuarioActual = usuario?.email || 'Anónimo';
  }

  ngOnDestroy() {
    if (this.chatChannel) {
      this.supabase.removeChannel(this.chatChannel);
    }
  }

  async cargarHistorial() {
    const { data, error } = await this.supabase
      .from('chat_mensajes')
      .select('*')
      .order('fecha_hora', { ascending: true });

    if (data) {
      this.mensajes = data;
      this.scrollAlFinal();
    }
  }

  conectarCanalRealtime() {
    this.chatChannel = this.supabase
      .channel('sala-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_mensajes' }, (payload) => {
        this.mensajes.push(payload.new as Mensaje);
        this.scrollAlFinal();
      })
      .subscribe();
  }

  async enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const mensajeAEnviar = {
      usuario: this.usuarioActual,
      texto: this.nuevoMensaje.trim(),
      fecha_hora: new Date().toISOString()
    };

    this.nuevoMensaje = '';

    const { error } = await this.supabase
      .from('chat_mensajes')
      .insert([mensajeAEnviar]);

    if (error) console.error('Error al enviar:', error.message);
  }

  scrollAlFinal() {
    setTimeout(() => {
      try {
        this.contenedorScroll.nativeElement.scrollTop = this.contenedorScroll.nativeElement.scrollHeight;
      } catch (err) {}
    }, 100);
  }
}