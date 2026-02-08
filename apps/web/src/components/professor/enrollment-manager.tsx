'use client';

import { useState, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import { useEnrolledStudents, useEnrollStudents, useRemoveStudent } from '@/hooks/use-courses';
import { usersService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  UserPlus,
  Trash2,
  Search,
  Users,
  Mail,
  Github,
  Loader2,
  Upload,
  FileText,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface EnrollmentManagerProps {
  courseId: string;
  courseName: string;
}

interface StudentToEnroll {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  githubUsername?: string;
}

export function EnrollmentManager({ courseId, courseName }: EnrollmentManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [availableStudents, setAvailableStudents] = useState<StudentToEnroll[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvEmails, setCsvEmails] = useState<string[]>([]);
  const [csvError, setCsvError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: enrolledStudents, isLoading, error, refetch } = useEnrolledStudents(courseId);
  const enrollMutation = useEnrollStudents();
  const removeMutation = useRemoveStudent();

  // Filter enrolled students based on search
  const filteredStudents = useMemo(() => {
    if (!enrolledStudents) return [];
    if (!searchQuery) return enrolledStudents;

    const query = searchQuery.toLowerCase();
    return enrolledStudents.filter(
      (e) =>
        e.student.firstName.toLowerCase().includes(query) ||
        e.student.lastName.toLowerCase().includes(query) ||
        e.student.email.toLowerCase().includes(query) ||
        (e.student.githubUsername?.toLowerCase().includes(query) ?? false),
    );
  }, [enrolledStudents, searchQuery]);

  // Load available students when dialog opens
  const loadAvailableStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const allUsers = await usersService.getAllUsers();
      // Filter to only students not already enrolled
      const enrolledIds = new Set(enrolledStudents?.map((e) => e.student.id) || []);
      const students = allUsers
        .filter((u) => u.role === 'STUDENT' && !enrolledIds.has(u.id))
        .map((u) => ({
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          githubUsername: u.githubUsername || undefined,
        }));
      setAvailableStudents(students);
    } catch {
      setAvailableStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleEnrollStudents = async () => {
    if (selectedStudents.length === 0) return;

    await enrollMutation.mutateAsync({
      courseId,
      data: { studentIds: selectedStudents },
    });

    setSelectedStudents([]);
    setIsEnrollDialogOpen(false);
    refetch();
  };

  const handleRemoveStudent = async (studentId: string) => {
    await removeMutation.mutateAsync({ courseId, studentId });
    refetch();
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === availableStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(availableStudents.map((s) => s.id));
    }
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    setCsvError('');

    Papa.parse(file, {
      complete: (results) => {
        try {
          // Expect CSV with email column
          const emails: string[] = [];
          const data = results.data as any[];

          // Check if header row exists with 'email' column
          const hasEmailColumn = data[0]?.email || data[0]?.Email;

          if (hasEmailColumn) {
            // CSV has headers
            for (let i = 1; i < data.length; i++) {
              const row = data[i];
              const email = row.email || row.Email;
              if (email && typeof email === 'string' && email.trim()) {
                emails.push(email.trim().toLowerCase());
              }
            }
          } else {
            // No headers, assume first column is email
            data.forEach((row: any) => {
              if (Array.isArray(row) && row[0]) {
                emails.push(row[0].toString().trim().toLowerCase());
              } else if (row && typeof row === 'object') {
                const firstValue = Object.values(row)[0];
                if (firstValue && typeof firstValue === 'string' && firstValue.trim()) {
                  emails.push(firstValue.trim().toLowerCase());
                }
              }
            });
          }

          if (emails.length === 0) {
            setCsvError('No valid emails found in CSV file');
            return;
          }

          setCsvEmails(emails);

          // Auto-select students matching the CSV emails
          const matchingIds = availableStudents
            .filter((s) => emails.includes(s.email.toLowerCase()))
            .map((s) => s.id);

          setSelectedStudents(matchingIds);

          if (matchingIds.length === 0) {
            setCsvError('No matching students found for the provided emails');
          } else if (matchingIds.length < emails.length) {
            setCsvError(
              `Only ${matchingIds.length} of ${emails.length} emails matched existing students`,
            );
          }
        } catch (error) {
          setCsvError('Failed to parse CSV file. Please check the format.');
        }
      },
      error: () => {
        setCsvError('Failed to read CSV file');
      },
      header: false,
    });
  };

  const clearCsvImport = () => {
    setCsvFile(null);
    setCsvEmails([]);
    setCsvError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load enrolled students</p>
            <Button variant="outline" onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Enrolled Students ({enrolledStudents?.length || 0})
          </CardTitle>
          <Dialog
            open={isEnrollDialogOpen}
            onOpenChange={(open) => {
              setIsEnrollDialogOpen(open);
              if (open) {
                loadAvailableStudents();
                setSelectedStudents([]);
                clearCsvImport();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Enroll Students
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Enroll Students in {courseName}</DialogTitle>
                <DialogDescription>
                  Select students manually or upload a CSV file with student emails.
                </DialogDescription>
              </DialogHeader>

              {isLoadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : availableStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No students available to enroll. All students are already enrolled or no student
                  accounts exist.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* CSV Import Section */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Import from CSV</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload a CSV file with student emails. File should have an "email" column or
                      emails in the first column.
                    </p>
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        className="hidden"
                        id="csv-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {csvFile ? 'Change File' : 'Upload CSV'}
                      </Button>
                      {csvFile && (
                        <Button type="button" variant="ghost" size="sm" onClick={clearCsvImport}>
                          Clear
                        </Button>
                      )}
                    </div>
                    {csvFile && (
                      <div className="mt-2 text-sm">
                        <span className="text-green-600">✓ {csvFile.name}</span>
                        <span className="text-gray-500 ml-2">
                          ({csvEmails.length} email{csvEmails.length !== 1 ? 's' : ''} found)
                        </span>
                      </div>
                    )}
                    {csvError && <div className="mt-2 text-sm text-amber-600">⚠ {csvError}</div>}
                  </div>

                  {/* Manual Selection Section */}
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Checkbox
                      checked={selectedStudents.length === availableStudents.length}
                      onCheckedChange={selectAllStudents}
                    />
                    <span className="text-sm font-medium">
                      Select all ({availableStudents.length} students)
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {availableStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleStudentSelection(student.id)}
                      >
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => toggleStudentSelection(student.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        {student.githubUsername && (
                          <span className="text-sm text-gray-400">@{student.githubUsername}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleEnrollStudents}
                  disabled={selectedStudents.length === 0 || enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    `Enroll ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {!enrolledStudents || enrolledStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No students enrolled in this course yet.</p>
            <Button variant="outline" onClick={() => setIsEnrollDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Enroll Your First Student
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>GitHub</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">
                        {enrollment.student.firstName} {enrollment.student.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {enrollment.student.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {enrollment.student.githubUsername ? (
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4 text-gray-400" />@
                            {enrollment.student.githubUsername}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(enrollment.enrolledAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{' '}
                                <strong>
                                  {enrollment.student.firstName} {enrollment.student.lastName}
                                </strong>{' '}
                                from this course? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveStudent(enrollment.student.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {removeMutation.isPending ? 'Removing...' : 'Remove'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredStudents.length === 0 && searchQuery && (
              <p className="text-center text-gray-500 py-4">No students match your search query.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
