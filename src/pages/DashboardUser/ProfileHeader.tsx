import React from "react";
import { Briefcase, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserData } from "@/types";

interface ProfileHeaderProps {
  userData: UserData;
  photoPreview?: string;
  totalProgress: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData, photoPreview, totalProgress }) => (
  <>
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-slate-800">Candidato Talento</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                <Home className="h-5 w-5 mr-2" />
                Início
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-600 hidden md:inline-block">Olá, {userData.name || "Usuário"}</span>
              <Avatar className="h-9 w-9 border border-slate-200">
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt="photo de perfil" />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div className="bg-indigo-700 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Meu Perfil</h1>
            <p className="mt-2 text-indigo-200 max-w-xl">
              Complete suas informações para aumentar suas chances.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative h-16 w-16">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: `conic-gradient(#4f46e5 ${totalProgress}%, transparent ${totalProgress}%)` }}
                  />
                  <div className="absolute inset-1 bg-indigo-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{totalProgress}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-white">Completando seu perfil</h3>
                  <p className="text-indigo-200 text-sm">Perfis completos recebem 3x mais oportunidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);