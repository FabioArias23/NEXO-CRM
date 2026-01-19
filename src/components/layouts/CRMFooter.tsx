export function CRMFooter() {
  return (
    <footer>
      <div className="text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
        <p className="text-sm text-balance max-sm:text-center">
          {`©${new Date().getFullYear()}`}{" "}
          <span className="text-primary font-semibold">NEXO-CRM</span> - Gestión
          Comercial Inteligente
        </p>

        <div className="flex items-center gap-4 text-xs">
          <a href="#" className="hover:text-foreground transition-colors">
            Soporte
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Documentación
          </a>
        </div>
      </div>
    </footer>
  );
}


