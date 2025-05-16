"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/lib/context/user-context";
import { ClassroomService } from "@/lib/services/classroom";
import { authService } from "@/lib/services/auth";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, BookOpen, Search, Grid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Classroom } from "@/lib/services/classroom";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Text,
  useGLTF,
  Environment,
  Stars,
} from "@react-three/drei";

// 3D Classroom Component
function Classroom3D({
  classroom,
  onClick,
  position,
}: {
  classroom: Classroom;
  onClick: () => void;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [rotation, setRotation] = useState(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        rotation + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (hovered) {
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {/* Classroom Building */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color={hovered ? "#60a5fa" : "#3b82f6"}
          metalness={0.8}
          roughness={0.2}
          emissive={hovered ? "#3b82f6" : "#1e40af"}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[1.5, 1, 4]} />
        <meshStandardMaterial
          color={hovered ? "#93c5fd" : "#60a5fa"}
          metalness={0.6}
          roughness={0.3}
          emissive={hovered ? "#60a5fa" : "#3b82f6"}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, -0.5, 1.01]} castShadow>
        <boxGeometry args={[0.6, 1, 0.1]} />
        <meshStandardMaterial
          color="#4b5563"
          emissive="#1f2937"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Windows */}
      <mesh position={[-0.8, 0.3, 1.01]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#60a5fa"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.8, 0.3, 1.01]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.1]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#60a5fa"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Classroom Name */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color={hovered ? "#ffffff" : "#e5e7eb"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {classroom.name}
      </Text>
    </group>
  );
}

// 3D Scene Component
function Scene({
  classrooms,
  onClassroomClick,
}: {
  classrooms: Classroom[];
  onClassroomClick: (id: string) => void;
}) {
  const gridSize = Math.ceil(Math.sqrt(classrooms.length));
  const spacing = 4;

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
      />

      {/* Cosmic Background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.3} />

      {/* Environment */}
      <Environment preset="night" />
      <fog attach="fog" args={["#000000", 5, 30]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Classrooms */}
      <group>
        {classrooms.map((classroom, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          const x = (col - gridSize / 2) * spacing;
          const z = (row - gridSize / 2) * spacing;
          return (
            <Classroom3D
              key={classroom._id}
              classroom={classroom}
              onClick={() => onClassroomClick(classroom._id)}
              position={[x, 0, z]}
            />
          );
        })}
      </group>
    </Canvas>
  );
}

export default function ClassroomsListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "3d">("grid");

  const isTeacher = user?.role === "teacher";

  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const classroomService = new ClassroomService(token);
        const data = await classroomService.getClassrooms();
        setClassrooms(data);
      } catch (error) {
        console.error("Error loading classrooms:", error);
        toast({
          title: "Error",
          description: "Failed to load classrooms. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClassrooms();
  }, [router, toast]);

  const handleJoinClassroom = async () => {
    if (!joinCode) {
      toast({
        title: "Error",
        description: "Please enter a classroom code",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      const token = authService.getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const classroomService = new ClassroomService(token);
      const classroom = await classroomService.joinClassroomByCode(joinCode);

      toast({
        title: "Success",
        description: `Joined classroom: ${classroom.name}`,
      });

      const updatedClassrooms = await classroomService.getClassrooms();
      setClassrooms(updatedClassrooms);
      setJoinCode("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to join classroom",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Classrooms</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search classrooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[300px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                size="icon"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "3d" ? "default" : "outline"}
                onClick={() => setViewMode("3d")}
                size="icon"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            {isTeacher ? (
              <Button
                onClick={() => router.push("/dashboard/classrooms/new")}
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Create Classroom
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter classroom code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-[200px] uppercase"
                  maxLength={6}
                />
                <Button
                  onClick={handleJoinClassroom}
                  disabled={isJoining || !joinCode}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-400 dark:to-purple-400 dark:hover:from-blue-500 dark:hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      Join Classroom
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {filteredClassrooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Classrooms Found
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {isTeacher
                  ? "Create your first classroom to get started"
                  : "Join a classroom using the code provided by your teacher"}
              </p>
              {isTeacher ? (
                <Button
                  onClick={() => router.push("/dashboard/classrooms/new")}
                  size="lg"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Classroom
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter classroom code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-[200px] uppercase"
                    maxLength={6}
                  />
                  <Button
                    onClick={handleJoinClassroom}
                    disabled={isJoining || !joinCode}
                    size="lg"
                    className="gap-2"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        Join Classroom
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => (
              <motion.div
                key={classroom._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() =>
                    router.push(`/dashboard/classrooms/${classroom._id}`)
                  }
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{classroom.name}</span>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {classroom.code}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {classroom.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Instructor: {classroom.instructor.name}</span>
                      <span>{classroom.students.length} students</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-[600px] w-full rounded-lg overflow-hidden border">
            <Scene
              classrooms={filteredClassrooms}
              onClassroomClick={(id) =>
                router.push(`/dashboard/classrooms/${id}`)
              }
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
