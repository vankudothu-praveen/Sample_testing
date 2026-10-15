#include "ui/ConsoleApplication.hpp"
#include "exceptions/Exceptions.hpp"

#include <charconv>
#include <iostream>
#include <limits>
#include <string>
#include <utility>

namespace studentrecords {
namespace {
std::string readLine(std::istream& in, std::ostream& out, const char* prompt) {
    out << prompt;
    std::string value;
    if (!std::getline(in, value)) throw std::runtime_error("Input closed");
    return value;
}
std::uint16_t readYear(std::istream& in, std::ostream& out) {
    const std::string text = readLine(in, out, "Year of study (1-8): ");
    unsigned value = 0;
    const auto [ptr, error] = std::from_chars(text.data(), text.data() + text.size(), value);
    if (error != std::errc{} || ptr != text.data() + text.size() || value > 65535)
        throw ValidationException("Year of study must be a number between 1 and 8");
    return static_cast<std::uint16_t>(value);
}
EnrollmentStatus readStatus(std::istream& in, std::ostream& out) {
    out << "Enrollment status (Active, Inactive, Suspended, Graduated)\n";
    const auto text = readLine(in, out, "> ");
    const auto status = enrollmentStatusFromString(text);
    if (!status) throw ValidationException("Unknown enrollment status");
    return *status;
}
Student readStudent(std::istream& in, std::ostream& out, std::string id = {}) {
    if (id.empty()) id = readLine(in, out, "Student ID: ");
    auto first = readLine(in, out, "First name: ");
    auto last = readLine(in, out, "Last name: ");
    auto email = readLine(in, out, "Email: ");
    auto course = readLine(in, out, "Course: ");
    auto year = readYear(in, out);
    auto status = readStatus(in, out);
    return Student(std::move(id), std::move(first), std::move(last), std::move(email),
                   std::move(course), year, status);
}
void printStudent(std::ostream& out, const Student& s) {
    out << "ID: " << s.studentId() << " | Name: " << s.firstName() << ' ' << s.lastName()
        << " | Email: " << s.email() << " | Course: " << s.course()
        << " | Year: " << s.yearOfStudy() << " | Status: " << toString(s.status()) << '\n';
}
}

ConsoleApplication::ConsoleApplication(StudentService& service, std::istream& input, std::ostream& output)
    : service_(service), input_(input), output_(output) {}

void ConsoleApplication::run() {
    output_ << "Student Records Manager\n";
    for (;;) {
        output_ << "\n1. Add student\n2. View student by ID\n3. List all students\n"
                   "4. Update student\n5. Delete student\n0. Exit\n";
        std::string choice;
        if (!std::getline(input_, choice)) return;
        if (choice == "0") return;
        try {
            if (choice == "1") addStudent();
            else if (choice == "2") viewStudent();
            else if (choice == "3") listStudents();
            else if (choice == "4") updateStudent();
            else if (choice == "5") deleteStudent();
            else output_ << "Choose a menu option from 0 to 5.\n";
        } catch (const std::exception& error) {
            output_ << "Error: " << error.what() << '\n';
            if (!input_) return;
        }
    }
}

void ConsoleApplication::addStudent() {
    service_.addStudent(readStudent(input_, output_));
    output_ << "Student added.\n";
}
void ConsoleApplication::viewStudent() {
    printStudent(output_, service_.getStudent(readLine(input_, output_, "Student ID: ")));
}
void ConsoleApplication::listStudents() {
    const auto students = service_.listStudents();
    if (students.empty()) { output_ << "No student records.\n"; return; }
    for (const auto& student : students) printStudent(output_, student);
}
void ConsoleApplication::updateStudent() {
    const auto id = readLine(input_, output_, "Student ID to update: ");
    (void)service_.getStudent(id);
    service_.updateStudent(readStudent(input_, output_, id));
    output_ << "Student updated.\n";
}
void ConsoleApplication::deleteStudent() {
    service_.deleteStudent(readLine(input_, output_, "Student ID to delete: "));
    output_ << "Student deleted.\n";
}

} // namespace studentrecords
