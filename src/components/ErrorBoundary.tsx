import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
          <div className="bg-card border border-border rounded-xl shadow-sm p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Algo deu errado
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Ocorreu um erro inesperado. Recarregue a página para tentar novamente.
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Recarregar
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
