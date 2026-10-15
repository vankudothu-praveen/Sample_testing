#pragma once

#include "service/StudentService.hpp"
#include <iosfwd>

namespace studentrecords {

class ConsoleApplication {
public:
    ConsoleApplication(StudentService& service, std::istream& input, std::ostream& output);
    void run();

private:
    StudentService& service_;
    std::istream& input_;
    std::ostream& output_;
    void addStudent();
    void viewStudent();
    void listStudents();
    void updateStudent();
    void deleteStudent();
};

} // namespace studentrecords
