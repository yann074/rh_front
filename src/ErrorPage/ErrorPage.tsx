import React from 'react';
import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';


interface RouterError {
  status?: number;
  statusText?: string;
  message?: string;
  data?: unknown;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError() as RouterError;
  const navigate = useNavigate();
  
  
  const errorMessage = (): string => {
    if (isRouteErrorResponse(error)) {
      
      return error.statusText || `Erro ${error.status}`;
    } else if (error instanceof Error) {
      
      return error.message;
    } else if (typeof error === 'string') {
      
      return error;
    }
    
    return "Ocorreu um erro inesperado";
  };
  
  
  const errorStatus = (): number | undefined => {
    if (isRouteErrorResponse(error)) {
      return error.status;
    }
    return undefined;
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-black/10">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <AlertTriangle className="h-12 w-12 text-black" />
          </div>
          <CardTitle className="text-4xl font-bold">Oops!</CardTitle>
          <p className="text-gray-500 text-lg">Página não encontrada</p>
        </CardHeader>
        
        <Separator className="w-16 mx-auto bg-black" />
        
        <CardContent className="text-center mt-6 space-y-4">
          <div className="p-4 bg-gray-100 rounded-md text-gray-800">
            <p className="font-mono">
              {errorMessage()}
            </p>
            {errorStatus() && (
              <p className="text-sm text-gray-500 mt-2">
                Status: {errorStatus()}
              </p>
            )}
          </div>
          
          <p className="text-sm text-gray-500">
            A rota solicitada não existe ou ocorreu um problema ao acessá-la.
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          <Button 
            variant="default" 
            className="bg-black hover:bg-gray-800 text-white"
            onClick={() => navigate('/')}
          >
            Voltar para o Início
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorPage;