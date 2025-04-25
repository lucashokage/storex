"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { PlusCircle, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useAuth()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer" as "admin" | "customer",
    emailVerified: true,
  })
  const [selectedUser, setSelectedUser] = useState<{
    id: string
    name: string
    email: string
    role: "admin" | "customer"
    emailVerified: boolean
  } | null>(null)

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    addUser({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      emailVerified: newUser.emailVerified,
    })

    toast({
      title: "Usuario creado",
      description: `El usuario ${newUser.name} ha sido creado exitosamente`,
    })

    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "customer",
      emailVerified: true,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditUser = () => {
    if (!selectedUser || !selectedUser.name || !selectedUser.email) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    updateUser(selectedUser.id, {
      name: selectedUser.name,
      email: selectedUser.email,
      role: selectedUser.role,
      emailVerified: selectedUser.emailVerified,
    })

    toast({
      title: "Usuario actualizado",
      description: `El usuario ${selectedUser.name} ha sido actualizado exitosamente`,
    })

    setIsEditDialogOpen(false)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    deleteUser(selectedUser.id)

    toast({
      title: "Usuario eliminado",
      description: `El usuario ${selectedUser.name} ha sido eliminado exitosamente`,
    })

    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (user: typeof selectedUser) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: typeof selectedUser) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <Button className="bg-[#9D2449] hover:bg-[#7D1D3A]" onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Verificado</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(user)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => openDeleteDialog(user)}
                        disabled={user.id === "admin-1"} // No permitir eliminar al admin principal
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Diálogo para añadir usuario */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
            <DialogDescription>Completa los campos para crear un nuevo usuario.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as "admin" | "customer" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="customer">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailVerified"
                checked={newUser.emailVerified}
                onChange={(e) => setNewUser({ ...newUser, emailVerified: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="emailVerified">Email verificado</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#9D2449] hover:bg-[#7D1D3A]" onClick={handleAddUser}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar usuario */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Modifica los campos para actualizar el usuario.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rol</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value as "admin" | "customer" })}
                  disabled={selectedUser.id === "admin-1"} // No permitir cambiar el rol del admin principal
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="customer">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-emailVerified"
                  checked={selectedUser.emailVerified}
                  onChange={(e) => setSelectedUser({ ...selectedUser, emailVerified: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-emailVerified">Email verificado</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#9D2449] hover:bg-[#7D1D3A]" onClick={handleEditUser}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar usuario */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p>
                Vas a eliminar al usuario <strong>{selectedUser.name}</strong> ({selectedUser.email}).
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
